const router = require('express').Router();
const { prisma } = require('../lib/db');

// GET /api/users — fetch all users with nearest DC
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { nearestDc: true },
      orderBy: { name: 'asc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
