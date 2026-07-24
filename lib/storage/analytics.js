/**
 * @fileoverview Manages time-series analytics data in chrome.storage.local
 */

import { STORAGE_KEYS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';
import { ErrorFactory } from '../utils/errors.js';

const MAX_ANALYTICS_POINTS = 100;

/**
 * Retrieves the historical analytics array.
 * @returns {Promise<Array<{timestamp: number, fiveHourPct: number, weeklyPct: number}>>}
 */
export async function getAnalytics() {
  try {
    const data = await chrome.storage.local.get(STORAGE_KEYS.ANALYTICS);
    return data[STORAGE_KEYS.ANALYTICS] || [];
  } catch (error) {
    logger.error('Failed to get analytics data', { error: error.message });
    return [];
  }
}

/**
 * Appends a new data point to the analytics history.
 * Only saves if the percentage has changed or significant time has passed to prevent flatlines.
 * @param {import('../models/usage.js').UsageData} usageData 
 */
export async function appendAnalyticsPoint(usageData) {
  try {
    let history = await getAnalytics();
    
    const newPoint = {
      timestamp: Date.now(),
      fiveHourPct: usageData.fiveHourPct,
      weeklyPct: usageData.weeklyPct
    };

    // Smart filling strategy: only record if percentages have changed, 
    // or if it has been more than 1 hour since the last point.
    if (history.length > 0) {
      const lastPoint = history[history.length - 1];
      const hasChanged = lastPoint.fiveHourPct !== newPoint.fiveHourPct || lastPoint.weeklyPct !== newPoint.weeklyPct;
      const hoursSinceLast = (newPoint.timestamp - lastPoint.timestamp) / (1000 * 60 * 60);
      
      if (!hasChanged && hoursSinceLast < 1) {
        return; // Skip saving to keep history lean
      }
    }

    history.push(newPoint);

    // Enforce cap
    if (history.length > MAX_ANALYTICS_POINTS) {
      history = history.slice(history.length - MAX_ANALYTICS_POINTS);
    }

    await chrome.storage.local.set({ [STORAGE_KEYS.ANALYTICS]: history });
    logger.debug('Appended analytics data point', { pointsCount: history.length });
  } catch (error) {
    logger.error('Failed to append analytics point', { error: error.message });
  }
}

/**
 * Clears the analytics history.
 */
export async function clearAnalytics() {
  try {
    await chrome.storage.local.remove(STORAGE_KEYS.ANALYTICS);
    logger.info('Analytics history cleared');
  } catch (error) {
    logger.error('Failed to clear analytics', { error: error.message });
  }
}
