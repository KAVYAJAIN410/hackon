const router = require('express').Router();
const { prisma } = require('../lib/db');

// POST /api/returns — initiate a return (simplified: no user choice for route)
router.post('/', async (req, res) => {
  try {
    const { orderId, userId, reason } = req.body;

    // Validate required fields
    if (!orderId || !userId || !reason) {
      return res.status(400).json({ error: 'orderId, userId, and reason are required' });
    }

    // Validate reason
    const validReasons = ['SIZE_FIT', 'CHANGED_MIND', 'QUALITY', 'NOT_AS_DESCRIBED', 'DEFECTIVE'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ error: `Invalid reason. Must be one of: ${validReasons.join(', ')}` });
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { nearestDc: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check order exists and belongs to user
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

    // Check no existing return for this order
    const existingReturn = await prisma.return.findFirst({
      where: { orderId },
    });
    if (existingReturn) {
      return res.status(400).json({ error: 'A return already exists for this order' });
    }

    // Create return record — status INITIATED, no route decision yet
    // Route will be decided automatically after AI grading
    const returnRecord = await prisma.return.create({
      data: {
        orderId,
        userId,
        reason,
        status: 'INITIATED',
        refundAmount: order.product.mrp,
        currentDcId: user.nearestDcId,
      },
      include: {
        order: { include: { product: true } },
        user: { include: { nearestDc: true } },
      },
    });

    res.status(201).json({
      returnId: returnRecord.id,
      status: returnRecord.status,
      message: 'Return initiated. Please upload product photos for AI grading.',
      return: returnRecord,
    });
  } catch (error) {
    console.error('Error creating return:', error);
    res.status(500).json({ error: 'Failed to create return' });
  }
});

// GET /api/returns?user_id= — fetch all returns for a user
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    const returns = await prisma.return.findMany({
      where: { userId: user_id },
      include: {
        order: { include: { product: true } },
        currentDc: true,
        grading: true,
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
        grading: true,
        images: true,
        inventoryItem: true,
      },
    });

    if (!returnRecord) {
      return res.status(404).json({ error: 'Return not found' });
    }

    res.json(returnRecord);
  } catch (error) {
    console.error('Error fetching return:', error);
    res.status(500).json({ error: 'Failed to fetch return' });
  }
});

module.exports = router;
