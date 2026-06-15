const router = require('express').Router();
const { prisma } = require('../lib/db');
const { calculateDeliveryCost, calculateViability } = require('../lib/costing');
const { GRADE_CONFIG, GREEN_CREDITS, COSTS } = require('../lib/constants');
const { authenticate } = require('../middleware/auth');

// GET /api/marketplace — fetch available products grouped by product with grade options
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch buyer info
    const buyer = await prisma.user.findUnique({
      where: { id: userId },
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
          include: { gradings: true, finalGrading: true },
        },
      },
    });

    // Fetch all DC routes for cost calculation
    const dcRoutes = await prisma.dcRoute.findMany();

    // Group items by productId
    const productMap = {};

    items.forEach(item => {
      const delivery = calculateDeliveryCost(item.currentDcId, buyer.nearestDcId, dcRoutes);
      const grading = item.return?.finalGrading || item.return?.gradings?.[0] || null;
      const gradeDiscountPct = grading?.gradeDiscountPct || GRADE_CONFIG[item.grade]?.discountPct || 20;

      const viability = calculateViability(
        parseFloat(item.product.mrp),
        gradeDiscountPct,
        delivery.totalShipping
      );

      // Skip non-viable items
      if (!viability.viable) return;

      const isNearYou = item.currentDcId === buyer.nearestDcId;
      const productId = item.productId;

      if (!productMap[productId]) {
        productMap[productId] = {
          productId,
          product: item.product,
          mrp: parseFloat(item.product.mrp),
          grades: {},
        };
      }

      const grade = item.grade;
      if (!productMap[productId].grades[grade]) {
        productMap[productId].grades[grade] = {
          grade,
          gradeLabel: GRADE_CONFIG[grade]?.label || grade,
          discountPct: gradeDiscountPct,
          sellingPrice: viability.sellingPrice,
          quantity: 0,
          items: [],
          // Use the closest/cheapest shipping for this grade
          bestShipping: delivery,
          isNearYou,
        };
      }

      const gradeEntry = productMap[productId].grades[grade];
      gradeEntry.quantity += 1;
      gradeEntry.items.push({
        inventoryItemId: item.id,
        currentDc: item.currentDc,
        shipping: delivery,
        isNearYou,
        totalPrice: viability.sellingPrice + delivery.totalShipping,
        grading: grading ? {
          grade: grading.grade,
          score: grading.score,
          confidence: parseFloat(grading.confidence),
          conditionSummary: grading.conditionSummary,
        } : null,
      });

      // Track the best (cheapest) option for this grade
      if (delivery.totalShipping < gradeEntry.bestShipping.totalShipping) {
        gradeEntry.bestShipping = delivery;
        gradeEntry.isNearYou = isNearYou;
      }
    });

    // Convert to array and format response
    const result = Object.values(productMap).map(entry => {
      const gradesArray = Object.values(entry.grades).sort((a, b) => {
        const order = ['A+', 'A', 'B', 'C', 'D', 'F'];
        return order.indexOf(a.grade) - order.indexOf(b.grade);
      });

      // Default to best available grade
      const bestGrade = gradesArray[0];

      return {
        productId: entry.productId,
        product: entry.product,
        mrp: entry.mrp,
        // Default display values (best grade)
        defaultGrade: bestGrade.grade,
        defaultGradeLabel: bestGrade.gradeLabel,
        defaultSellingPrice: bestGrade.sellingPrice,
        defaultTotalPrice: bestGrade.sellingPrice + bestGrade.bestShipping.totalShipping,
        defaultShipping: bestGrade.bestShipping,
        isNearYou: bestGrade.isNearYou,
        discountPct: bestGrade.discountPct,
        // All available grades for this product (like Cashify's Fair/Good/Superb)
        availableGrades: gradesArray.map(g => ({
          grade: g.grade,
          gradeLabel: g.gradeLabel,
          quantity: g.quantity,
          sellingPrice: g.sellingPrice,
          discountPct: g.discountPct,
          totalPrice: g.sellingPrice + g.bestShipping.totalShipping,
          shipping: g.bestShipping,
          isNearYou: g.isNearYou,
          // First inventory item ID for this grade (for buying)
          inventoryItemId: g.items[0]?.inventoryItemId,
        })),
        totalQuantity: gradesArray.reduce((sum, g) => sum + g.quantity, 0),
        greenCreditsOnPurchase: GREEN_CREDITS.PURCHASE_RELOOP,
      };
    });

    // Sort: products with near-you items first, then by default price
    result.sort((a, b) => {
      if (a.isNearYou && !b.isNearYou) return -1;
      if (!a.isNearYou && b.isNearYou) return 1;
      return a.defaultTotalPrice - b.defaultTotalPrice;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
});

// GET /api/marketplace/:id — product detail with all available grades
// :id can be a productId (from grouped listing) or inventoryItemId (legacy)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const buyer = await prisma.user.findUnique({
      where: { id: userId },
      include: { nearestDc: true },
    });
    if (!buyer) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Try as productId first, then as inventoryItemId
    let productId = id;
    const asInventory = await prisma.inventoryItem.findUnique({ where: { id } });
    if (asInventory) {
      productId = asInventory.productId;
    }

    // Get product info
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate high return risk
    const totalOrders = await prisma.order.count({ where: { productId } });
    const totalReturns = await prisma.return.count({ where: { order: { productId } } });
    const returnRate = totalOrders > 0 ? (totalReturns / totalOrders) : 0;
    const highReturnRisk = returnRate > 0.20;

    // Get all available inventory items for this product
    const items = await prisma.inventoryItem.findMany({
      where: { productId, status: 'AVAILABLE' },
      include: {
        currentDc: true,
        return: {
          include: { gradings: true, finalGrading: true, images: true },
        },
      },
    });

    if (items.length === 0) {
      return res.status(404).json({ error: 'No available inventory for this product' });
    }

    const dcRoutes = await prisma.dcRoute.findMany();

    // Group by grade with full details
    const gradeMap = {};
    items.forEach(item => {
      const delivery = calculateDeliveryCost(item.currentDcId, buyer.nearestDcId, dcRoutes);
      const grading = item.return?.finalGrading || item.return?.gradings?.[0] || null;
      const gradeDiscountPct = grading?.gradeDiscountPct || GRADE_CONFIG[item.grade]?.discountPct || 20;
      const viability = calculateViability(parseFloat(product.mrp), gradeDiscountPct, delivery.totalShipping);
      const isNearYou = item.currentDcId === buyer.nearestDcId;

      if (!gradeMap[item.grade]) {
        gradeMap[item.grade] = {
          grade: item.grade,
          gradeLabel: GRADE_CONFIG[item.grade]?.label || item.grade,
          discountPct: gradeDiscountPct,
          sellingPrice: viability.sellingPrice,
          quantity: 0,
          items: [],
        };
      }

      gradeMap[item.grade].quantity += 1;
      gradeMap[item.grade].items.push({
        inventoryItemId: item.id,
        currentDc: item.currentDc,
        shipping: delivery,
        totalPrice: viability.sellingPrice + delivery.totalShipping,
        isNearYou,
        grading: grading ? {
          id: grading.id,
          grade: grading.grade,
          score: grading.score,
          confidence: parseFloat(grading.confidence),
          conditionSummary: grading.conditionSummary,
          defectsFound: grading.defectsFound,
          missingParts: grading.missingParts,
          functionalNotes: grading.functionalNotes,
        } : null,
        images: item.return?.images || [],
      });
    });

    const availableGrades = Object.values(gradeMap).sort((a, b) => {
      const order = ['A+', 'A', 'B', 'C', 'D', 'F'];
      return order.indexOf(a.grade) - order.indexOf(b.grade);
    });

    const bestGrade = availableGrades[0];
    const bestItem = bestGrade.items[0];

    res.json({
      productId: product.id,
      product,
      mrp: parseFloat(product.mrp),
      buyerDc: buyer.nearestDc,
      availableGrades,
      // Default selection (best grade, nearest item)
      defaultGrade: bestGrade.grade,
      defaultGradeLabel: bestGrade.gradeLabel,
      defaultSellingPrice: bestGrade.sellingPrice,
      defaultShipping: bestItem.shipping,
      defaultTotalPrice: bestItem.totalPrice,
      defaultInventoryItemId: bestItem.inventoryItemId,
      isNearYou: bestItem.isNearYou,
      discountPct: bestGrade.discountPct,
      totalQuantity: availableGrades.reduce((s, g) => s + g.quantity, 0),
      greenCreditsOnPurchase: GREEN_CREDITS.PURCHASE_RELOOP,
      // Health card from best item
      grading: bestItem.grading,
      images: bestItem.images,
      highReturnRisk,
    });
  } catch (error) {
    console.error('Error fetching marketplace item:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace item' });
  }
});

// POST /api/marketplace/:id/buy — purchase an item
router.post('/:id/buy', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { pledgeMade } = req.body || {};
    const buyerId = req.user.id;

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
      const baseCredits = GREEN_CREDITS.PURCHASE_RELOOP;
      const pledgeCredits = pledgeMade ? 50 : 0;
      const totalCreditsAwarded = baseCredits + pledgeCredits;

      await tx.greenCreditLedger.create({
        data: {
          userId: buyerId,
          amount: totalCreditsAwarded,
          action: pledgeMade ? 'PURCHASE_RELOOP_WITH_PLEDGE' : 'PURCHASE_RELOOP',
          referenceId: marketplaceOrder.id,
          description: `Purchased ${item.product.name} on ReLoop marketplace${pledgeMade ? ' (Green Pledge)' : ''}`,
        },
      });

      // Update buyer's green credits and tier
      const updatedBuyer = await tx.user.update({
        where: { id: buyerId },
        data: {
          greenCredits: { increment: totalCreditsAwarded },
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

    res.status(201).json({
      orderId: result.id,
      orderNumber: `RL-${result.id.slice(0, 8).toUpperCase()}`,
      productName: item.product.name,
      productImage: item.product.imageUrl,
      grade: item.grade,
      sellingPrice,
      shippingCost,
      totalPrice,
      creditsAwarded: GREEN_CREDITS.PURCHASE_RELOOP + (pledgeMade ? 50 : 0),
      estimatedDays: delivery.estimatedDays,
      shipsFrom: item.currentDcId,
      status: 'CONFIRMED',
      message: `Your ${item.product.name} is confirmed and on its way!`,
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});

module.exports = router;
