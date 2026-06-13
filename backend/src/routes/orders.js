const router = require('express').Router();
const { prisma } = require('../lib/db');

// GET /api/orders?user_id= — fetch user's orders with outgrown eligibility
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user_id },
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
