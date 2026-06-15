const router = require('express').Router();
const { prisma } = require('../lib/db');
const { authenticate } = require('../middleware/auth');

// GET /api/orders — fetch user's orders (original + refurbished purchases) with outgrown eligibility
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Original orders (products bought new)
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        product: true,
        returns: { select: { id: true, status: true } },
      },
      orderBy: { orderedAt: 'desc' },
    });

    // Find which orders have already been listed via resell (Outgrown)
    const outgrownItems = await prisma.inventoryItem.findMany({
      where: { source: 'OUTGROWN', listedByUserId: userId },
      select: { sourceOrderId: true },
    });
    const listedOrderIds = new Set(outgrownItems.map(i => i.sourceOrderId).filter(Boolean));

    // Find pledged orders (Green Pledge → never returnable)
    const pledges = await prisma.greenCreditLedger.findMany({
      where: { userId, action: 'PURCHASE_RELOOP_WITH_PLEDGE' },
      select: { referenceId: true },
    });
    const pledgedOrderIds = new Set(pledges.map(p => p.referenceId).filter(Boolean));

    // 30-day return window helper
    const within30Days = (date) => {
      if (!date) return false;
      const days = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 30;
    };

    // Find marketplace orders that already have a return
    const marketplaceReturns = await prisma.return.findMany({
      where: { userId, marketplaceOrderId: { not: null }, status: { not: 'CANCELLED' } },
      select: { marketplaceOrderId: true },
    });
    const returnedMarketplaceIds = new Set(marketplaceReturns.map(r => r.marketplaceOrderId).filter(Boolean));

    const originalOrders = orders.map(order => {
      const hasActiveOutgrown = listedOrderIds.has(order.id);
      const hasActiveReturn = order.returns.length > 0;
      const hasPledge = pledgedOrderIds.has(order.id);
      const withinWindow = within30Days(order.orderedAt);
      return {
        id: order.id,
        product: order.product,
        status: order.status,
        orderedAt: order.orderedAt,
        source: 'ORIGINAL',
        hasActiveOutgrown,
        hasActiveReturn,
        hasPledge,
        withinReturnWindow: withinWindow,
        returnEligible: order.status === 'DELIVERED' && !hasActiveReturn && !hasActiveOutgrown && !hasPledge && withinWindow,
        outgrownEligible: order.status === 'DELIVERED' && !hasActiveReturn && !hasActiveOutgrown,
      };
    });

    // Marketplace orders (refurbished items bought from ReLoop)
    const marketplaceOrders = await prisma.marketplaceOrder.findMany({
      where: { buyerId: userId },
      include: {
        inventoryItem: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const refurbishedOrders = marketplaceOrders.map(mo => {
      const hasPledge = pledgedOrderIds.has(mo.id);
      const hasActiveReturn = returnedMarketplaceIds.has(mo.id);
      const isReturnRequested = mo.status === 'RETURN_REQUESTED';
      const withinWindow = within30Days(mo.createdAt);
      return {
        id: mo.id,
        orderNumber: `RL-${mo.id.slice(0, 8).toUpperCase()}`,
        product: mo.inventoryItem?.product || null,
        grade: mo.inventoryItem?.grade || null,
        sellingPrice: parseFloat(mo.sellingPrice),
        shippingCost: parseFloat(mo.shippingCost),
        totalPrice: parseFloat(mo.totalPrice),
        // Map CONFIRMED → ONGOING for display
        status: mo.status === 'CONFIRMED' ? 'ONGOING' : mo.status,
        orderedAt: mo.createdAt,
        source: 'REFURBISHED',
        hasPledge,
        hasActiveReturn,
        hasActiveOutgrown: false,
        withinReturnWindow: withinWindow,
        // Refurbished items are returnable unless pledged, already returned, or past 30-day window
        returnEligible: !hasPledge && !hasActiveReturn && !isReturnRequested && withinWindow,
        outgrownEligible: false,
      };
    });

    // Combine and sort by date (newest first)
    const result = [...originalOrders, ...refurbishedOrders].sort(
      (a, b) => new Date(b.orderedAt) - new Date(a.orderedAt)
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
