const router = require('express').Router();
const { prisma } = require('../lib/db');
const { getTierForCredits, getNextTierInfo, GREEN_CREDITS } = require('../lib/constants');

// GET /api/green-credits?user_id= — user credit balance, tier, history
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const history = await prisma.greenCreditLedger.findMany({
      where: { userId: user_id },
      orderBy: { createdAt: 'desc' },
    });

    const tier = getTierForCredits(user.greenCredits);
    const nextTierInfo = getNextTierInfo(user.greenCredits);

    // Count products given a second life by this user
    const productsSecondLife = await prisma.return.count({
      where: {
        userId: user_id,
        routeDecision: { in: ['RESELL', 'DONATE', 'REFURBISH'] },
      },
    });

    // CO2 saved by this user
    const co2Saved = parseFloat((productsSecondLife * 0.45).toFixed(2));

    res.json({
      balance: user.greenCredits,
      tier,
      nextTier: nextTierInfo.nextTier,
      nextTierAt: nextTierInfo.nextTierAt,
      creditsNeeded: nextTierInfo.creditsNeeded,
      history,
      impact: {
        productsSecondLife,
        co2SavedKg: co2Saved,
      },
    });
  } catch (error) {
    console.error('Error fetching green credits:', error);
    res.status(500).json({ error: 'Failed to fetch green credits' });
  }
});

// POST /api/green-credits/award — internal endpoint to award credits
router.post('/award', async (req, res) => {
  try {
    const { userId, amount, action, referenceId, description } = req.body;

    if (!userId || !amount || !action) {
      return res.status(400).json({ error: 'userId, amount, and action are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create ledger entry
      const entry = await tx.greenCreditLedger.create({
        data: {
          userId,
          amount,
          action,
          referenceId: referenceId || null,
          description: description || `${action}: ${amount} credits awarded`,
        },
      });

      // Update user balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          greenCredits: { increment: amount },
        },
      });

      // Update tier if needed
      const newTier = getTierForCredits(updatedUser.greenCredits);
      if (newTier !== updatedUser.greenTier) {
        await tx.user.update({
          where: { id: userId },
          data: { greenTier: newTier },
        });
      }

      return { entry, updatedUser: { ...updatedUser, greenTier: newTier } };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error awarding credits:', error);
    res.status(500).json({ error: 'Failed to award credits' });
  }
});

module.exports = router;
