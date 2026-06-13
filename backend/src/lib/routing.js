const { COSTS, GRADE_CONFIG } = require('./constants');

/**
 * Decide the optimal route for a returned product.
 *
 * @param {string}  grade          - AI-assigned grade (A+, A, B, C, D, F)
 * @param {number}  mrp            - Original MRP of the product
 * @param {number}  sellingPrice   - Calculated selling price after grade discount
 * @param {number}  totalCost      - Total logistics cost (handling + transfer + last mile)
 * @param {boolean} hasLocalBuyers - Whether buyers exist near the current DC
 * @returns {{ chosenRoute: string, reason: string, alternatives: Array }}
 */
function decideRoute(grade, mrp, sellingPrice, totalCost, hasLocalBuyers) {
  const config = GRADE_CONFIG[grade];
  if (!config) {
    return {
      chosenRoute: 'RECYCLE',
      reason: `Unknown grade "${grade}" — routing to recycle for safety.`,
      alternatives: [],
    };
  }

  const minMrp = config.minMrp;
  const profit = sellingPrice - totalCost - COSTS.MIN_MARGIN;

  // ─── Evaluate all 4 route alternatives ───
  const alternatives = [];

  // 1. RESELL evaluation
  const resellViable =
    ['A+', 'A', 'B'].includes(grade) &&
    sellingPrice > totalCost + COSTS.MIN_MARGIN &&
    (minMrp === null || mrp >= minMrp);

  alternatives.push({
    route: 'RESELL',
    viable: resellViable,
    reason: !['A+', 'A', 'B'].includes(grade)
      ? `Grade ${grade} not eligible for resale`
      : minMrp !== null && mrp < minMrp
        ? `MRP ₹${mrp} below minimum ₹${minMrp} for grade ${grade}`
        : sellingPrice <= totalCost + COSTS.MIN_MARGIN
          ? `Selling price ₹${sellingPrice} doesn't cover cost ₹${totalCost} + margin ₹${COSTS.MIN_MARGIN}`
          : hasLocalBuyers
            ? `Profitable locally: ₹${sellingPrice} - ₹${totalCost} = ₹${profit} margin`
            : `Profitable: ₹${sellingPrice} - ₹${totalCost} = ₹${profit} margin`,
    sellingPrice,
    totalCost,
    profit: resellViable ? profit : sellingPrice - totalCost - COSTS.MIN_MARGIN,
  });

  // 2. REFURBISH evaluation
  const refurbishViable = ['B', 'C'].includes(grade) && mrp >= 500;

  alternatives.push({
    route: 'REFURBISH',
    viable: refurbishViable,
    reason: !['B', 'C'].includes(grade)
      ? `Grade ${grade} not suitable for refurbishment`
      : mrp < 500
        ? `MRP ₹${mrp} too low to justify refurbishment cost`
        : `Grade ${grade} item can be restored and resold after refurbishment`,
    sellingPrice: refurbishViable ? Math.round(mrp * 0.5) : 0,
    totalCost: refurbishViable ? totalCost + 150 : 0, // refurbishment adds ~₹150
    profit: refurbishViable ? Math.round(mrp * 0.5) - totalCost - 150 : 0,
  });

  // 3. DONATE evaluation
  const donateViable = grade !== 'F'; // Can't donate broken/hazardous items

  alternatives.push({
    route: 'DONATE',
    viable: donateViable,
    reason: grade === 'F'
      ? 'Grade F items may be hazardous — cannot donate'
      : !resellViable
        ? `Not viable for resale — donate locally for ₹17 instead of ₹${COSTS.OLD_SYSTEM_COST_PER_ITEM} old system cost`
        : `Could donate, but resale is more valuable`,
    sellingPrice: 0,
    totalCost: 17, // Donation cost: ₹2 AI grading + ₹15 NGO pickup
    profit: 0,
  });

  // 4. RECYCLE evaluation
  const recycleViable = true; // Always possible as last resort

  alternatives.push({
    route: 'RECYCLE',
    viable: recycleViable,
    reason: grade === 'F'
      ? 'Safety hazard — must be sent to certified e-waste recycler'
      : 'Last resort — item sent to recycling facility',
    sellingPrice: 0,
    totalCost: 25, // Recycling pickup cost
    profit: 0,
  });

  // ─── Choose the best route ───
  let chosenRoute;
  let reason;

  if (grade === 'F') {
    chosenRoute = 'RECYCLE';
    reason = 'Grade F — safety hazard, must recycle via certified e-waste facility.';
  } else if (resellViable) {
    chosenRoute = 'RESELL';
    reason = hasLocalBuyers
      ? `Grade ${grade}, profitable (₹${profit} margin), local buyers available — list on marketplace.`
      : `Grade ${grade}, profitable (₹${profit} margin) — list on marketplace.`;
  } else if (refurbishViable) {
    chosenRoute = 'REFURBISH';
    reason = `Grade ${grade}, not directly resellable but can be refurbished (MRP ₹${mrp}).`;
  } else if (donateViable) {
    chosenRoute = 'DONATE';
    reason = `Not viable for resale (cost ₹${totalCost} > selling price ₹${sellingPrice}). Smart donate for ₹17 vs old system ₹${COSTS.OLD_SYSTEM_COST_PER_ITEM}.`;
  } else {
    chosenRoute = 'RECYCLE';
    reason = 'No viable route — sending to recycling.';
  }

  return { chosenRoute, reason, alternatives };
}

/**
 * Get demand signal — count of users near a DC who have bought in the same category.
 * Powers the "X buyers near you want this" display.
 *
 * @param {string} productId - The product to check demand for
 * @param {string} dcId      - The delivery center to check local demand around
 * @param {object} prisma    - PrismaClient instance
 * @returns {Promise<number>} Count of interested local buyers
 */
async function getDemandSignal(productId, dcId, prisma) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return 0;

  const count = await prisma.user.count({
    where: {
      nearestDcId: dcId,
      orders: {
        some: {
          product: { category: product.category },
        },
      },
    },
  });

  return count;
}

module.exports = { decideRoute, getDemandSignal };
