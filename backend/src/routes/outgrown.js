const router = require('express').Router();
const { prisma } = require('../lib/db');
const { GREEN_CREDITS, getTierForCredits } = require('../lib/constants');
const { getDemandSignal } = require('../lib/routing');
const { authenticate } = require('../middleware/auth');

// POST /api/outgrown — list a delivered product for resale (Outgrown It)
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, conditionLabel } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // Verify order exists, belongs to user, and is DELIVERED
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Order does not belong to this user' });
    }
    if (order.status !== 'DELIVERED') {
      return res.status(400).json({ error: 'Order must be in DELIVERED status' });
    }

    // Check no return or inventory already exists
    const existingReturn = await prisma.return.findFirst({
      where: { orderId },
    });
    if (existingReturn) {
      return res.status(400).json({ error: 'A return already exists for this order' });
    }

    const existingInventory = await prisma.inventoryItem.findFirst({
      where: { productId: order.productId, source: 'OUTGROWN' },
    });
    if (existingInventory) {
      return res.status(400).json({ error: 'This product is already listed on the marketplace' });
    }

    // Get user for DC info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { nearestDc: true },
    });

    // Create inventory item — assumed grade A for outgrown (user kept it in good condition)
    const sellingPrice = Math.round(parseFloat(order.product.mrp) * 0.6); // 60% of MRP

    const result = await prisma.$transaction(async (tx) => {
      const inventoryItem = await tx.inventoryItem.create({
        data: {
          productId: order.productId,
          currentDcId: user.nearestDcId,
          status: 'AVAILABLE',
          grade: 'A',
          basePrice: parseFloat(order.product.mrp),
          sellingPrice,
          source: 'OUTGROWN',
        },
        include: {
          product: true,
          currentDc: true,
        },
      });

      // Award green credits for outgrown listing
      await tx.greenCreditLedger.create({
        data: {
          userId,
          amount: GREEN_CREDITS.OUTGROWN_LISTING,
          action: 'OUTGROWN_LISTING',
          referenceId: inventoryItem.id,
          description: `Listed ${order.product.name} via Outgrown It — earned ${GREEN_CREDITS.OUTGROWN_LISTING} credits`,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { greenCredits: { increment: GREEN_CREDITS.OUTGROWN_LISTING } },
      });

      const newTier = getTierForCredits(updatedUser.greenCredits);
      if (newTier !== updatedUser.greenTier) {
        await tx.user.update({
          where: { id: userId },
          data: { greenTier: newTier },
        });
      }

      return { inventoryItem, updatedUser };
    });

    // Get demand signal
    const demandCount = await getDemandSignal(order.productId, user.nearestDcId, prisma);

    res.status(201).json({
      inventoryItem: result.inventoryItem,
      demandSignal: demandCount,
      creditsAwarded: GREEN_CREDITS.OUTGROWN_LISTING,
      message: `${order.product.name} listed on ReLoop marketplace! ${demandCount > 0 ? `${demandCount} buyers near ${user.nearestDc?.city || 'you'} are interested.` : 'Buyers will be notified.'}`,
    });
  } catch (error) {
    console.error('Error creating outgrown listing:', error);
    res.status(500).json({ error: 'Failed to create outgrown listing' });
  }
});

module.exports = router;
