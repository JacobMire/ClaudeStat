/**
 * @fileoverview API endpoint for fetching usage data.
 */

import { API_PATHS } from '../utils/constants.js';
import { apiFetch } from './client.js';
import { logger } from '../utils/logger.js';

/**
 * Fetches raw usage data for a given organization ID.
 * @param {string} orgId - The organization UUID.
 * @returns {Promise<Object>} The raw JSON response from Claude.
 */
export async function getUsageForOrg(orgId) {
  const url = `${API_PATHS.BASE_URL}${API_PATHS.USAGE(orgId)}`;
  try {
    const rawData = await apiFetch(url);
    logger.info('Fetched raw usage data', { orgId, rawData });
    return rawData;
  } catch (error) {
    logger.error('Failed to fetch usage data', { orgId, error });
    throw error;
  }
}
