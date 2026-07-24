/**
 * @fileoverview Normalizes raw Claude API responses into canonical models.
 * Insulates the rest of the application from backend API changes.
 */

import { ErrorFactory } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { DEFAULT_SETTINGS } from '../utils/constants.js';

const CURRENT_SCHEMA_VERSION = DEFAULT_SETTINGS.schemaVersion;

/**
 * Normalizes a raw usage API response.
 * @param {Object} rawData - The raw JSON response.
 * @param {string} orgId - The organization ID.
 * @returns {import('../models/usage.js').UsageData} The canonical usage data.
 * @throws {AppError} If the schema cannot be parsed.
 */
export function normalizeUsage(rawData, orgId) {
  try {
    let fiveHourPct = 0;
    let fiveHourResetAt = null;
    let weeklyPct = 0;
    let weeklyResetAt = null;

    if (rawData?.five_hour) {
      fiveHourPct = Number(rawData.five_hour.utilization || 0);
      fiveHourResetAt = rawData.five_hour.resets_at || null;
    }

    if (rawData?.seven_day) {
      weeklyPct = Number(rawData.seven_day.utilization || 0);
      weeklyResetAt = rawData.seven_day.resets_at || null;
    }

    const normalized = {
      orgId,
      orgName: rawData.org_name || 'My Organization',
      fiveHourPct: Math.min(100, Math.max(0, fiveHourPct)),
      fiveHourResetAt,
      weeklyPct: Math.min(100, Math.max(0, weeklyPct)),
      weeklyResetAt,
      fetchedAt: Date.now(),
      schemaVersion: CURRENT_SCHEMA_VERSION,
    };

    logger.debug('Normalized usage data', { normalized });
    return normalized;

  } catch (error) {
    logger.error('Normalization failed', { error, rawData });
    throw ErrorFactory.schema('Failed to parse API response', { originalError: error.message, rawData });
  }
}
