const router = require('express').Router();
const { prisma } = require('../lib/db');
const { calculateDeliveryCost, calculateViability } = require('../lib/costing');
const { GRADE_CONFIG, GREEN_CREDITS, COSTS } = require('../lib/constants');

// GET /api/marketplace?user_id= — fetch available inventory with per-buyer pricing
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    // Fetch buyer info
    const buyer = await prisma.user.findUnique({
      where: { id: user_id },
      include: { nearestDc: true },
    });
    if (!buyer) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch all available inventory items
    const items = await prisma.inventoryItem.findMany({
      where: { status: 'AVAILABLE' },
      include: {
        product: true,
        currentDc: true,
        return: {
          include: { grading: true },
        },
      },
    });

    // Fetch all DC routes for cost calculation
    const dcRoutes = await prisma.dcRoute.findMany();

    // Calculate per-buyer pricing for each item
    const pricedItems = items.map(item => {
      const delivery = calculateDeliveryCost(item.currentDcId, buyer.nearestDcId, dcRoutes);
      const grading = item.return?.grading;
      const gradeDiscountPct = grading?.gradeDiscountPct || GRADE_CONFIG[item.grade]?.discountPct || 20;

      const viability = calculateViability(
        parseFloat(item.product.mrp),
        gradeDiscountPct,
        delivery.totalShipping
      );

      const isNearYou = item.currentDcId === buyer.nearestDcId;

      return {
        id: item.id,
        product: item.product,
        grade: item.grade,
        gradeLabel: GRADE_CONFIG[item.grade]?.label || item.grade,
        source: item.source,
        currentDc: item.currentDc,
        basePrice: parseFloat(item.basePrice),
        sellingPrice: viability.sellingPrice,
        mrp: parseFloat(item.product.mrp),
        discountPct: gradeDiscountPct,
        shipping: delivery,
        totalPrice: viability.sellingPrice + delivery.totalShipping,
        isNearYou,
        viable: viability.viable,
        greenCreditsOnPurchase: GREEN_CREDITS.PURCHASE_RELOOP,
        grading: grading ? {
          grade: grading.grade,
          score: grading.score,
          confidence: parseFloat(grading.confidence),
          conditionSummary: grading.conditionSummary,
        } : null,
      };
    });

    // Filter out non-viable items
    const viableItems = pricedItems.filter(item => item.viable);

    // Sort: near items first, then by selling price
    viableItems.sort((a, b) => {
      if (a.isNearYou && !b.isNearYou) return -1;
      if (!a.isNearYou && b.isNearYou) return 1;
      return a.totalPrice - b.totalPrice;
    });

    res.json(viableItems);
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
});

// GET /api/marketplace/:id?user_id= — single item detail with full pricing + health card
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    const buyer = await prisma.user.findUnique({
      where: { id: user_id },
      include: { nearestDc: true },
    });
    if (!buyer) {
      return res.status(404).json({ error: 'User not found' });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        product: true,
        currentDc: true,
        return: {
          include: {
            grading: true,
            images: true,
          },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const dcRoutes = await prisma.dcRoute.findMany();
    const delivery = calculateDeliveryCost(item.currentDcId, buyer.nearestDcId, dcRoutes);
    const grading = item.return?.grading;
    const gradeDiscountPct = grading?.gradeDiscountPct || GRADE_CONFIG[item.grade]?.discountPct || 20;

    const viability = calculateViability(
      parseFloat(item.product.mrp),
      gradeDiscountPct,
      delivery.totalShipping
    );

    const isNearYou = item.currentDcId === buyer.nearestDcId;

    res.json({
      id: item.id,
      product: item.product,
      grade: item.grade,
      gradeLabel: GRADE_CONFIG[item.grade]?.label || item.grade,
      source: item.source,
      currentDc: item.currentDc,
      buyerDc: buyer.nearestDc,
      basePrice: parseFloat(item.basePrice),
      sellingPrice: viability.sellingPrice,
      mrp: parseFloat(item.product.mrp),
      discountPct: gradeDiscountPct,
      shipping: delivery,
      totalPrice: viability.sellingPrice + delivery.totalShipping,
      isNearYou,
      viable: viability.viable,
      profit: viability.profit,
      greenCreditsOnPurchase: GREEN_CREDITS.PURCHASE_RELOOP,
      grading: grading ? {
        id: grading.id,
        grade: grading.grade,
        score: grading.score,
        confidence: parseFloat(grading.confidence),
        conditionSummary: grading.conditionSummary,
        defectsFound: grading.defectsFound,
        missingParts: grading.missingParts,
        functionalNotes: grading.functionalNotes,
        routeDecision: grading.routeDecision,
      } : null,
      images: item.return?.images || [],
    });
  } catch (error) {
    console.error('Error fetching marketplace item:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace item' });
  }
});

// POST /api/marketplace/:id/buy — purchase an item
router.post('/:id/buy', async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerId } = req.body;

    if (!buyerId) {
      return res.status(400).json({ error: 'buyerId is required' });
    }

    // Verify buyer exists
    const buyer = await prisma.user.findUnique({
      where: { id: buyerId },
      include: { nearestDc: true },
    });
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    // Verify item is available
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    if (item.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Item is no longer available' });
    }

    // Calculate shipping
    const dcRoutes = await prisma.dcRoute.findMany();
    const delivery = calculateDeliveryCost(item.currentDcId, buyer.nearestDcId, dcRoutes);

    const sellingPrice = parseFloat(item.sellingPrice);
    const shippingCost = delivery.totalShipping;
    const totalPrice = sellingPrice + shippingCost;

    // Transaction: create order, update inventory, award credits
    const result = await prisma.$transaction(async (tx) => {
      // Create marketplace order
      const marketplaceOrder = await tx.marketplaceOrder.create({
        data: {
          inventoryItemId: id,
          buyerId,
          sellingPrice,
          shippingCost,
          totalPrice,
          status: 'CONFIRMED',
        },
      });

      // Update inventory item status to SOLD
      await tx.inventoryItem.update({
        where: { id },
        data: { status: 'SOLD' },
      });

      // Update linked return status if exists
      if (item.returnId) {
        await tx.return.update({
          where: { id: item.returnId },
          data: { status: 'SOLD' },
        });
      }

      // Award green credits to buyer
      await tx.greenCreditLedger.create({
        data: {
          userId: buyerId,
          amount: GREEN_CREDITS.PURCHASE_RELOOP,
          action: 'PURCHASE_RELOOP',
          referenceId: marketplaceOrder.id,
          description: `Purchased ${item.product.name} on ReLoop marketplace`,
        },
      });

      // Update buyer's green credits and tier
      const updatedBuyer = await tx.user.update({
        where: { id: buyerId },
        data: {
          greenCredits: { increment: GREEN_CREDITS.PURCHASE_RELOOP },
        },
      });

      // Update tier
      const { getTierForCredits } = require('../lib/constants');
      const newTier = getTierForCredits(updatedBuyer.greenCredits);
      if (newTier !== updatedBuyer.greenTier) {
        await tx.user.update({
          where: { id: buyerId },
          data: { greenTier: newTier },
        });
      }

      return marketplaceOrder;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});

module.exports = router;
