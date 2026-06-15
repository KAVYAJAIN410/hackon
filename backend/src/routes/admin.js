const router = require('express').Router();
const { prisma } = require('../lib/db');
const { COSTS } = require('../lib/constants');

// GET /api/admin/overview — full system intelligence dashboard
router.get('/overview', async (req, res) => {
  try {
    // Returns by status
    const returnsByStatus = await prisma.return.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const returnStatusMap = {};
    returnsByStatus.forEach(r => {
      returnStatusMap[r.status] = r._count.id;
    });

    // Returns by route decision
    const returnsByRoute = await prisma.return.groupBy({
      by: ['routeDecision'],
      _count: { id: true },
    });
    const routeMap = {};
    returnsByRoute.forEach(r => {
      if (r.routeDecision) {
        routeMap[r.routeDecision] = r._count.id;
      }
    });

    // Inventory by status
    const inventoryByStatus = await prisma.inventoryItem.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const invStatusMap = {};
    inventoryByStatus.forEach(i => {
      invStatusMap[i.status] = i._count.id;
    });

    // Inventory by grade
    const inventoryByGrade = await prisma.inventoryItem.groupBy({
      by: ['grade'],
      _count: { id: true },
    });
    const gradeMap = {};
    inventoryByGrade.forEach(i => {
      gradeMap[i.grade] = i._count.id;
    });

    // Per-DC inventory counts
    const dcInventory = await prisma.inventoryItem.groupBy({
      by: ['currentDcId', 'status'],
      _count: { id: true },
    });
    // Reshape into per-DC objects
    const dcMap = {};
    dcInventory.forEach(item => {
      if (!dcMap[item.currentDcId]) dcMap[item.currentDcId] = {};
      dcMap[item.currentDcId][item.status] = item._count.id;
    });

    // Fetch DC details for names
    const dcs = await prisma.deliveryCenter.findMany();
    const dcDetails = dcs.map(dc => ({
      id: dc.id,
      name: dc.name,
      city: dc.city,
      type: dc.type,
      inventory: dcMap[dc.id] || {},
    }));

    // Marketplace orders
    const totalMarketplaceOrders = await prisma.marketplaceOrder.count();

    // Total green credits awarded
    const creditsResult = await prisma.greenCreditLedger.aggregate({
      _sum: { amount: true },
    });
    const totalGreenCredits = creditsResult._sum.amount || 0;

    // Total items processed
    const totalItems = await prisma.inventoryItem.count();
    const totalReturns = await prisma.return.count();

    // CO2 saved
    const itemsSaved = (invStatusMap['AVAILABLE'] || 0) + (invStatusMap['SOLD'] || 0) + (routeMap['DONATE'] || 0);
    const co2SavedKg = parseFloat((itemsSaved * 0.45).toFixed(2));

    // Cost savings vs old system
    const reloopAvgCost = COSTS.HANDLING_TOTAL + COSTS.LAST_MILE_DELIVERY; // ~107
    const costSavingsVsOldSystem = {
      oldSystemCostPerItem: COSTS.OLD_SYSTEM_COST_PER_ITEM,
      reloopAvgCostPerItem: reloopAvgCost,
      savingsPerItem: COSTS.OLD_SYSTEM_COST_PER_ITEM - reloopAvgCost,
      totalItemsProcessed: totalItems,
      totalOldCost: totalItems * COSTS.OLD_SYSTEM_COST_PER_ITEM,
      totalReloopCost: totalItems * reloopAvgCost,
      totalSavings: totalItems * (COSTS.OLD_SYSTEM_COST_PER_ITEM - reloopAvgCost),
    };

    // Returns table — recent returns
    const recentReturns = await prisma.return.findMany({
      include: {
        order: { include: { product: true } },
        gradings: true,
        currentDc: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      returnsByStatus: returnStatusMap,
      returnsByRoute: routeMap,
      inventoryByStatus: invStatusMap,
      inventoryByGrade: gradeMap,
      dcInventory: dcDetails,
      totalReturns,
      totalMarketplaceOrders,
      totalGreenCredits,
      co2SavedKg,
      costSavingsVsOldSystem,
      recentReturns,
    });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    res.status(500).json({ error: 'Failed to fetch admin overview' });
  }
});

module.exports = router;
