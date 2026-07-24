/**
 * @fileoverview Analytics Engine for calculating burn rates and projections.
 */

/**
 * Calculates the current burn rate and projects exhaustion time.
 * @param {Array<{timestamp: number, fiveHourPct: number, weeklyPct: number}>} history
 * @returns {Object} Projections object
 */
export function calculateProjections(history) {
  if (!history || history.length < 2) {
    return {
      hasEnoughData: false,
      burnRatePctPerHour: 0,
      fiveHourExhaustionMs: null,
      sessionImpactPct: 0
    };
  }

  const latest = history[history.length - 1];
  
  // Find a valid anchor point in the past to calculate the burn rate.
  // We scan backwards up to 3 hours. If we see a percentage drop, a reset occurred, 
  // so we stop there and use the lowest point as the anchor.
  let anchor = history[history.length - 2];
  const MAX_LOOKBACK_MS = 3 * 60 * 60 * 1000; 

  for (let i = history.length - 2; i >= 0; i--) {
    const pt = history[i];
    
    // Stop if we go too far back
    if (latest.timestamp - pt.timestamp > MAX_LOOKBACK_MS) {
      break;
    }

    // Stop if a reset occurred between this point and the next
    if (pt.fiveHourPct > history[i+1].fiveHourPct) {
      break;
    }

    anchor = pt;
  }

  const timeDeltaHours = (latest.timestamp - anchor.timestamp) / (1000 * 60 * 60);
  const pctDelta = latest.fiveHourPct - anchor.fiveHourPct;

  let burnRatePctPerHour = 0;
  if (timeDeltaHours > 0) {
    burnRatePctPerHour = pctDelta / timeDeltaHours;
  }

  let fiveHourExhaustionMs = null;
  if (burnRatePctPerHour > 1) { // Only project if burning at least 1% an hour
    const remainingPct = 100 - latest.fiveHourPct;
    const hoursUntilEmpty = remainingPct / burnRatePctPerHour;
    fiveHourExhaustionMs = hoursUntilEmpty * 60 * 60 * 1000;
  }

  return {
    hasEnoughData: true,
    burnRatePctPerHour: Math.max(0, burnRatePctPerHour),
    fiveHourExhaustionMs,
    sessionImpactPct: Math.max(0, pctDelta)
  };
}
