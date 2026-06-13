// Cost constants used in routing and costing logic
// Must match business rules exactly

const COSTS = {
  LAST_MILE_PICKUP: 65,
  LAST_MILE_DELIVERY: 65,
  HANDLING_PER_ITEM: 15,
  QUALITY_CHECK: 12,
  REPACKAGING: 8,
  PHOTOGRAPHY: 7,
  HANDLING_TOTAL: 42, // 15 + 12 + 8 + 7
  MIN_MARGIN: 20,
  PLATFORM_FEE_PCT: 5,
  OLD_SYSTEM_COST_PER_ITEM: 440,
};

const GRADE_CONFIG = {
  'A+': { label: 'Like New',       discountPct: 10, defaultRoute: 'RESELL',     minMrp: 100 },
  'A':  { label: 'Excellent',      discountPct: 20, defaultRoute: 'RESELL',     minMrp: 150 },
  'B':  { label: 'Good',           discountPct: 35, defaultRoute: 'RESELL',     minMrp: 3000 },
  'C':  { label: 'Fair',           discountPct: 50, defaultRoute: 'REFURBISH',  minMrp: null },
  'D':  { label: 'Poor',           discountPct: 0,  defaultRoute: 'DONATE',     minMrp: null },
  'F':  { label: 'Unsalvageable',  discountPct: 0,  defaultRoute: 'RECYCLE',    minMrp: null },
};

const GREEN_CREDITS = {
  RETURN_COMPLETED: 10,
  RESELL_ROUTE: 50,
  DONATE_ROUTE: 100,
  REFURBISH_ROUTE: 30,
  RECYCLE_ROUTE: 10,
  PURCHASE_RELOOP: 25,
  OUTGROWN_LISTING: 75,
};

// Tier thresholds
const TIER_THRESHOLDS = [
  { tier: 'FOREST',  minCredits: 2000 },
  { tier: 'TREE',    minCredits: 500 },
  { tier: 'SAPLING', minCredits: 100 },
  { tier: 'SEEDLING', minCredits: 0 },
];

function getTierForCredits(credits) {
  for (const t of TIER_THRESHOLDS) {
    if (credits >= t.minCredits) return t.tier;
  }
  return 'SEEDLING';
}

function getNextTierInfo(credits) {
  const currentTier = getTierForCredits(credits);
  const currentIndex = TIER_THRESHOLDS.findIndex(t => t.tier === currentTier);
  if (currentIndex <= 0) return { nextTier: null, nextTierAt: null, creditsNeeded: 0 };
  const next = TIER_THRESHOLDS[currentIndex - 1];
  return {
    nextTier: next.tier,
    nextTierAt: next.minCredits,
    creditsNeeded: next.minCredits - credits,
  };
}

module.exports = {
  COSTS,
  GRADE_CONFIG,
  GREEN_CREDITS,
  TIER_THRESHOLDS,
  getTierForCredits,
  getNextTierInfo,
};
