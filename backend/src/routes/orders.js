const router = require('express').Router();
const { prisma } = require('../lib/db');
const { authenticate } = require('../middleware/auth');

// GET /api/orders — fetch user's orders with outgrown eligibility
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        product: true,
        returns: { select: { id: true } },
      },
      orderBy: { orderedAt: 'desc' },
    });

    const result = orders.map(order => ({
      id: order.id,
      product: order.product,
      status: order.status,
      orderedAt: order.orderedAt,
      // Eligible for "Outgrown It" if delivered and no return exists
      outgrownEligible: order.status === 'DELIVERED' && order.returns.length === 0,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
