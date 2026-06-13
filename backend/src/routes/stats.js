const router = require('express').Router();
const { prisma } = require('../lib/db');

// GET /api/stats — platform-wide statistics
router.get('/', async (req, res) => {
  try {
    // Count returns by status
    const totalReturns = await prisma.return.count();
    
    // Count inventory items by status
    const inventoryCounts = await prisma.inventoryItem.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const statusMap = {};
    inventoryCounts.forEach(item => {
      statusMap[item.status] = item._count.id;
    });

    const totalListed = statusMap['AVAILABLE'] || 0;
    const totalSold = statusMap['SOLD'] || 0;

    // Count returns by route decision for donated/recycled
    const routeCounts = await prisma.return.groupBy({
      by: ['routeDecision'],
      _count: { id: true },
    });

    const routeMap = {};
    routeCounts.forEach(item => {
      if (item.routeDecision) {
        routeMap[item.routeDecision] = item._count.id;
      }
    });

    const totalDonated = routeMap['DONATE'] || 0;
    const totalRecycled = routeMap['RECYCLE'] || 0;
    const totalRefurbished = routeMap['REFURBISH'] || 0;

    // CO2 saved: each resold/listed/donated item saves ~0.45kg
    const itemsSaved = totalListed + totalSold + totalDonated;
    const co2SavedKg = parseFloat((itemsSaved * 0.45).toFixed(2));

    // Total green credits awarded
    const creditsResult = await prisma.greenCreditLedger.aggregate({
      _sum: { amount: true },
    });
    const totalGreenCredits = creditsResult._sum.amount || 0;

    res.json({
      totalReturns,
      totalListed,
      totalSold,
      totalDonated,
      totalRecycled,
      totalRefurbished,
      co2SavedKg,
      totalGreenCredits,
      itemsSaved,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
