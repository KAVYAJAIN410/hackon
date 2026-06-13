const { COSTS, GRADE_CONFIG } = require('./constants');

/**
 * Calculate delivery cost between two DCs
 * @param {string} sourceDcId - Source delivery center ID
 * @param {string} destDcId - Destination delivery center ID (buyer's nearest DC)
 * @param {Array} dcRoutes - Array of DC route records from DB
 * @returns {{ transferCost: number, lastMile: number, totalShipping: number, estimatedDays: number }}
 */
function calculateDeliveryCost(sourceDcId, destDcId, dcRoutes) {
  // Same DC — no transfer cost
  if (sourceDcId === destDcId) {
    return {
      transferCost: 0,
      lastMile: COSTS.LAST_MILE_DELIVERY,
      totalShipping: COSTS.LAST_MILE_DELIVERY,
      estimatedDays: 1,
    };
  }

  // Find route between DCs
  const route = dcRoutes.find(
    r => r.sourceDcId === sourceDcId && r.destDcId === destDcId
  );

  if (route) {
    const transferCost = parseFloat(route.transferCost);
    return {
      transferCost,
      lastMile: COSTS.LAST_MILE_DELIVERY,
      totalShipping: transferCost + COSTS.LAST_MILE_DELIVERY,
      estimatedDays: route.estimatedDays,
    };
  }

  // Default fallback if no route found
  return {
    transferCost: 50,
    lastMile: COSTS.LAST_MILE_DELIVERY,
    totalShipping: 50 + COSTS.LAST_MILE_DELIVERY,
    estimatedDays: 5,
  };
}

/**
 * Calculate viability of selling a returned product
 * @param {number} mrp - Original MRP of the product
 * @param {number} gradeDiscountPct - Discount percentage based on grade
 * @param {number} shippingCost - Total shipping cost to buyer
 * @returns {{ viable: boolean, sellingPrice: number, totalCost: number, profit: number }}
 */
function calculateViability(mrp, gradeDiscountPct, shippingCost) {
  const sellingPrice = Math.round(mrp * (1 - gradeDiscountPct / 100));
  const totalCost = COSTS.HANDLING_TOTAL + shippingCost + COSTS.MIN_MARGIN;
  const profit = sellingPrice - totalCost;
  const viable = profit > 0;

  return {
    viable,
    sellingPrice,
    totalCost,
    profit,
  };
}

module.exports = {
  calculateDeliveryCost,
  calculateViability,
};
