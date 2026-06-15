const router = require('express').Router();
const { prisma } = require('../lib/db');

// GET /api/seller/returns?seller_id= — fetch seller's returns with analytics
router.get('/returns', async (req, res) => {
  try {
    const { seller_id } = req.query;

    // For hackathon: seller_id maps to a user — fetch all returns for simplicity
    // In production this would filter by product seller/vendor
    const returns = await prisma.return.findMany({
      include: {
        order: { include: { product: true } },
        gradings: true,
        currentDc: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute analytics
    const reasonCounts = {};
    const gradeCounts = {};
    let resellableCount = 0;
    let totalRecovery = 0;

    returns.forEach(r => {
      // Return reasons breakdown
      reasonCounts[r.reason] = (reasonCounts[r.reason] || 0) + 1;

      // Grade distribution
      if (r.grading) {
        gradeCounts[r.grading.grade] = (gradeCounts[r.grading.grade] || 0) + 1;

        if (['RESELL', 'REFURBISH'].includes(r.grading.routeDecision)) {
          resellableCount++;
          if (r.grading.estimatedResaleValue) {
            totalRecovery += parseFloat(r.grading.estimatedResaleValue);
          }
        }
      }
    });

    const totalGraded = returns.filter(r => r.grading).length;
    const recoveryRate = totalGraded > 0 ? (resellableCount / totalGraded * 100).toFixed(1) : 0;

    // Return reasons as percentages
    const totalReturns = returns.length;
    const returnReasonsBreakdown = Object.entries(reasonCounts).map(([reason, count]) => ({
      reason,
      count,
      percentage: totalReturns > 0 ? parseFloat((count / totalReturns * 100).toFixed(1)) : 0,
    }));

    const gradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({
      grade,
      count,
      percentage: totalGraded > 0 ? parseFloat((count / totalGraded * 100).toFixed(1)) : 0,
    }));

    res.json({
      returns,
      analytics: {
        totalReturns,
        totalGraded,
        resellableCount,
        totalRecovery: Math.round(totalRecovery),
        recoveryRate: parseFloat(recoveryRate),
        returnReasonsBreakdown,
        gradeDistribution,
        timeSavedHours: Math.round(totalGraded * 3 / 60), // ~3 min saved per AI grading vs manual
      },
    });
  } catch (error) {
    console.error('Error fetching seller returns:', error);
    res.status(500).json({ error: 'Failed to fetch seller returns' });
  }
});

// POST /api/seller/returns/:id/override — seller overrides grade
router.post('/returns/:id/override', async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, sellingPrice } = req.body;

    if (!grade) {
      return res.status(400).json({ error: 'grade is required' });
    }

    const grading = await prisma.aiGrading.findUnique({
      where: { returnId: id },
    });
    if (!grading) {
      return res.status(404).json({ error: 'Grading not found for this return' });
    }

    const updated = await prisma.aiGrading.update({
      where: { id: grading.id },
      data: {
        grade,
        ...(sellingPrice && { estimatedResaleValue: sellingPrice }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error overriding grade:', error);
    res.status(500).json({ error: 'Failed to override grade' });
  }
});

module.exports = router;
