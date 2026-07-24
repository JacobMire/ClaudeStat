/**
 * @fileoverview API endpoint for fetching user organizations.
 */

import { API_PATHS } from '../utils/constants.js';
import { apiFetch } from './client.js';
import { logger } from '../utils/logger.js';

/**
 * Fetches the list of organizations the user belongs to.
 * @returns {Promise<Array<Object>>} The raw list of organizations.
 */
export async function getOrganizations() {
  const url = `${API_PATHS.BASE_URL}${API_PATHS.ORGANIZATIONS}`;
  try {
    const orgs = await apiFetch(url);
    logger.info('Fetched organizations', { count: orgs.length });
    return orgs;
  } catch (error) {
    logger.error('Failed to fetch organizations', { error });
    throw error;
  }
}
