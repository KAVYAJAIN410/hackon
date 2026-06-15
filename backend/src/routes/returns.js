const router = require('express').Router();
const { prisma } = require('../lib/db');
const { authenticate } = require('../middleware/auth');

// POST /api/returns — create a PENDING return (not finalized yet)
// Supports both original orders and refurbished (marketplace) purchases.
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, reason } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ error: 'orderId and reason are required' });
    }

    const validReasons = ['SIZE_FIT', 'CHANGED_MIND', 'QUALITY', 'NOT_AS_DESCRIBED', 'DEFECTIVE'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ error: `Invalid reason. Must be one of: ${validReasons.join(', ')}` });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { nearestDc: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Determine if this is an original order or a refurbished (marketplace) order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });

    let marketplaceOrder = null;
    if (!order) {
      marketplaceOrder = await prisma.marketplaceOrder.findUnique({
        where: { id: orderId },
        include: { inventoryItem: { include: { product: true } } },
      });
    }

    if (!order && !marketplaceOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ownership check
    if (order && order.userId !== userId) {
      return res.status(403).json({ error: 'Order does not belong to this user' });
    }
    if (marketplaceOrder && marketplaceOrder.buyerId !== userId) {
      return res.status(403).json({ error: 'Order does not belong to this user' });
    }

    // --- Green Pledge Strict Block (refurbished purchases with a pledge cannot be returned) ---
    const hasPledge = await prisma.greenCreditLedger.findFirst({
      where: {
        userId,
        referenceId: orderId,
        action: 'PURCHASE_RELOOP_WITH_PLEDGE',
      },
    });
    if (hasPledge) {
      return res.status(403).json({
        error: 'Return denied: You made a Green Pledge to keep this item and earned bonus Green Credits. Returns are disabled for this order to reduce carbon footprint.',
      });
    }

    // Check no existing non-cancelled return for this order
    const existingReturn = await prisma.return.findFirst({
      where: {
        status: { not: 'CANCELLED' },
        OR: [{ orderId }, { marketplaceOrderId: orderId }],
      },
    });
    if (existingReturn) {
      return res.status(400).json({ error: 'A return already exists for this order', returnId: existingReturn.id });
    }

    // Resolve product + refund amount based on order type
    const product = order ? order.product : marketplaceOrder.inventoryItem?.product;
    const refundAmount = order ? order.product.mrp : marketplaceOrder.totalPrice;

    // --- 30-day return window enforcement ---
    const refDate = order ? order.orderedAt : marketplaceOrder.createdAt;
    const daysSince = (Date.now() - new Date(refDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 30) {
      return res.status(400).json({
        error: 'Return window closed: items can only be returned within 30 days of delivery.',
      });
    }

    // Create return with PENDING status — link to the correct order type
    const returnRecord = await prisma.return.create({
      data: {
        orderId: order ? orderId : null,
        marketplaceOrderId: marketplaceOrder ? orderId : null,
        userId,
        reason,
        status: 'PENDING',
        refundAmount,
        currentDcId: user.nearestDcId,
      },
      include: {
        order: { include: { product: true } },
        marketplaceOrder: { include: { inventoryItem: { include: { product: true } } } },
        user: { include: { nearestDc: true } },
      },
    });

    res.status(201).json({
      returnId: returnRecord.id,
      status: 'PENDING',
      message: 'Return created. Upload product photos for AI grading, then confirm to finalize.',
      return: returnRecord,
    });
  } catch (error) {
    console.error('Error creating return:', error);
    res.status(500).json({ error: 'Failed to create return' });
  }
});

// POST /api/returns/:id/confirm — finalize the return after grading
// This is when the return becomes real: delivery associate assigned, status → INITIATED
router.post('/:id/confirm', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const returnRecord = await prisma.return.findUnique({
      where: { id },
      include: { user: { include: { nearestDc: true } }, order: { include: { product: true } } },
    });

    if (!returnRecord) return res.status(404).json({ error: 'Return not found' });
    if (returnRecord.userId !== userId) return res.status(403).json({ error: 'Not your return' });
    if (returnRecord.status !== 'PENDING' && returnRecord.status !== 'GRADED') {
      return res.status(400).json({ error: `Cannot confirm return in ${returnRecord.status} status` });
    }

    // Assign delivery associate
    let assignedPickupAssociateId = null;
    const userDcId = returnRecord.user.nearestDcId;
    if (userDcId) {
      const availableDriver = await prisma.deliveryAssociate.findFirst({
        where: { assignedDcId: userDcId, currentStatus: 'AVAILABLE' },
      });
      if (availableDriver) {
        assignedPickupAssociateId = availableDriver.id;
        await prisma.deliveryAssociate.update({
          where: { id: availableDriver.id },
          data: { currentStatus: 'ON_DELIVERY' },
        });
      }
    }

    // Finalize the return
    const updated = await prisma.return.update({
      where: { id },
      data: {
        status: 'INITIATED',
        pickupAssociateId: assignedPickupAssociateId,
      },
      include: {
        order: { include: { product: true } },
        user: { include: { nearestDc: true } },
        gradings: true,
      },
    });

    // Update order status — handle both original and marketplace orders
    if (returnRecord.orderId) {
      await prisma.order.update({
        where: { id: returnRecord.orderId },
        data: { status: 'RETURN_REQUESTED' },
      });
    } else if (returnRecord.marketplaceOrderId) {
      await prisma.marketplaceOrder.update({
        where: { id: returnRecord.marketplaceOrderId },
        data: { status: 'RETURN_REQUESTED' },
      });
    }

    res.json({
      returnId: updated.id,
      status: updated.status,
      pickupAssociateId: assignedPickupAssociateId,
      message: 'Return confirmed! A delivery associate will pick up your product.',
      return: updated,
    });
  } catch (error) {
    console.error('Error confirming return:', error);
    res.status(500).json({ error: 'Failed to confirm return' });
  }
});

// POST /api/returns/:id/cancel — cancel a pending return and clean up all related data
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const returnRecord = await prisma.return.findUnique({
      where: { id },
      include: { gradings: true, images: true, inventoryItem: true },
    });

    if (!returnRecord) return res.status(404).json({ error: 'Return not found' });
    if (returnRecord.userId !== userId) return res.status(403).json({ error: 'Not your return' });

    // Only allow cancel if PENDING or GRADED (not yet confirmed)
    if (!['PENDING', 'GRADED'].includes(returnRecord.status)) {
      return res.status(400).json({ error: `Cannot cancel return in ${returnRecord.status} status. Contact support.` });
    }

    // Clean up everything in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete final grading
      await tx.finalGrading.deleteMany({ where: { returnId: id } });

      // Delete AI gradings
      await tx.aiGrading.deleteMany({ where: { returnId: id } });

      // Delete return images
      await tx.returnImage.deleteMany({ where: { returnId: id } });

      // Delete inventory item if any
      await tx.inventoryItem.deleteMany({ where: { returnId: id } });

      // Delete green credit entries for this return
      await tx.greenCreditLedger.deleteMany({ where: { referenceId: id } });

      // Delete the return record itself
      await tx.return.delete({ where: { id } });
    });

    res.json({ message: 'Return cancelled and all related data cleaned up.', returnId: id });
  } catch (error) {
    console.error('Error cancelling return:', error);
    res.status(500).json({ error: 'Failed to cancel return' });
  }
});

// GET /api/returns — fetch all returns for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const returns = await prisma.return.findMany({
      where: { userId, status: { not: 'CANCELLED' } },
      include: {
        order: { include: { product: true } },
        currentDc: true,
        gradings: true,
        finalGrading: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(returns);
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({ error: 'Failed to fetch returns' });
  }
});

// GET /api/returns/by-associate — fetch returns assigned to a delivery associate
router.get('/by-associate', async (req, res) => {
  const { associate_id } = req.query;
  if (!associate_id) return res.status(400).json({ error: 'associate_id required' });
  try {
    const returns = await prisma.return.findMany({
      where: { pickupAssociateId: associate_id },
      include: {
        order: { include: { product: true } },
        user: true,
        gradings: true,
        finalGrading: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(returns);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch assigned pickups' });
  }
});

// GET /api/returns/:id — fetch single return with full details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const returnRecord = await prisma.return.findUnique({
      where: { id },
      include: {
        order: { include: { product: true } },
        user: { include: { nearestDc: true } },
        currentDc: true,
        gradings: true,
        finalGrading: true,
        images: true,
        inventoryItem: true,
      },
    });

    if (!returnRecord) return res.status(404).json({ error: 'Return not found' });
    res.json(returnRecord);
  } catch (error) {
    console.error('Error fetching return:', error);
    res.status(500).json({ error: 'Failed to fetch return' });
  }
});

module.exports = router;
