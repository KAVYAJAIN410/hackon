const { GRADE_CONFIG, COSTS } = require('./constants');
const { calculateDeliveryCost, calculateViability } = require('./costing');

/**
 * Decide the route for a returned product based on AI grade and viability
 * This is the SOLE decision-maker — the user does NOT choose.
 * 
 * @param {string} grade - AI-assigned grade (A+, A, B, C, D, F)
 * @param {number} mrp - Original MRP of product
 * @param {number} shippingCost - Estimated total shipping cost
 * @param {boolean} hasLocalBuyers - Whether there are buyers near the DC
 * @returns {{ chosenRoute: string, reason: string, alternatives: Array }}
 */
function decideRoute(grade, mrp, shippingCost, hasLocalBuyers = false) {
  const gradeConfig = GRADE_CONFIG[grade] || GRADE_CONFIG['D'];
  const alternatives = [];

  // Evaluate RESELL viability
  const resellViability = calculateViability(mrp, gradeConfig.discountPct, shippingCost);
  const resellViable = resellViability.viable
    && ['A+', 'A', 'B'].includes(grade)
    && (gradeConfig.minMrp === null || mrp >= gradeConfig.minMrp);

  alternatives.push({
    route: 'RESELL',
    viable: resellViable,
    reason: resellViable
      ? `Selling price ₹${resellViability.sellingPrice} covers costs ₹${resellViability.totalCost} with ₹${resellViability.profit} margin`
      : resellViability.profit <= 0
        ? `Selling price ₹${resellViability.sellingPrice} < minimum cost ₹${resellViability.totalCost}`
        : `Grade ${grade} not eligible for direct resale`,
    sellingPrice: resellViability.sellingPrice,
    totalCost: resellViability.totalCost,
    profit: resellViability.profit,
  });

  // Evaluate REFURBISH viability
  const refurbishViable = ['B', 'C'].includes(grade) && mrp >= 500;
  alternatives.push({
    route: 'REFURBISH',
    viable: refurbishViable,
    reason: refurbishViable
      ? `Grade ${grade} product worth ₹${mrp} can be refurbished for resale`
      : grade === 'F'
        ? 'Product is unsalvageable — cannot be refurbished'
        : `Grade ${grade} does not need refurbishment or MRP too low`,
    sellingPrice: refurbishViable ? Math.round(mrp * 0.5) : 0,
    totalCost: refurbishViable ? COSTS.HANDLING_TOTAL + 100 : 0, // +100 refurb cost estimate
    profit: refurbishViable ? Math.round(mrp * 0.5) - (COSTS.HANDLING_TOTAL + 100) : 0,
  });

  // Evaluate DONATE viability
  const donateViable = grade !== 'F';
  alternatives.push({
    route: 'DONATE',
    viable: donateViable,
    reason: donateViable
      ? 'Product is in usable condition and can be donated'
      : 'Product is unsafe or unsalvageable — cannot be donated',
    sellingPrice: 0,
    totalCost: COSTS.HANDLING_TOTAL,
    profit: 0,
  });

  // Evaluate RECYCLE viability
  alternatives.push({
    route: 'RECYCLE',
    viable: true,
    reason: grade === 'F'
      ? 'Product is unsalvageable — must be recycled/scrapped'
      : 'Any product can be recycled as a last resort',
    sellingPrice: 0,
    totalCost: COSTS.HANDLING_TOTAL,
    profit: 0,
  });

  // Decision logic: Amazon decides based on grade and viability
  let chosenRoute;
  let reason;

  if (resellViable) {
    chosenRoute = 'RESELL';
    reason = `Grade ${grade} product is viable for resale at ₹${resellViability.sellingPrice} (${gradeConfig.discountPct}% off MRP). ${hasLocalBuyers ? 'Local buyers available.' : ''}`;
  } else if (refurbishViable) {
    chosenRoute = 'REFURBISH';
    reason = `Grade ${grade} product needs refurbishment before resale. Estimated post-refurb value: ₹${Math.round(mrp * 0.5)}.`;
  } else if (donateViable) {
    chosenRoute = 'DONATE';
    reason = `Product is not viable for resale (cost ₹${resellViability.totalCost} > selling price ₹${resellViability.sellingPrice}) but is in usable condition. Routed to donation.`;
  } else {
    chosenRoute = 'RECYCLE';
    reason = `Product graded ${grade} — unsalvageable. Routed to responsible recycling/scrapping.`;
  }

  return {
    chosenRoute,
    reason,
    alternatives,
  };
}

/**
 * Get demand signal: count of users near a DC interested in a product category
 */
async function getDemandSignal(productId, dcId, prisma) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { category: true },
    });

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
  } catch {
    return 0;
  }
}

module.exports = {
  decideRoute,
  getDemandSignal,
};
