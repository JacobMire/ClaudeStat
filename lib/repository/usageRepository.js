/**
 * @fileoverview Repository layer for fetching, caching, and normalizing usage data.
 * The UI layer should only interact with this module.
 */

import { getSettings, updateSettings } from '../storage/settings.js';
import { getUsageCache, setUsageCache } from '../storage/cache.js';
import { getOrganizations } from '../api/organizations.js';
import { getUsageForOrg } from '../api/usage.js';
import { normalizeUsage } from '../api/normalizer.js';
import { logger } from '../utils/logger.js';
import { ErrorFactory } from '../utils/errors.js';

/**
 * Retrieves the current canonical UsageData, attempting network fetch.
 * Designed to be called from the Service Worker.
 * @returns {Promise<import('../models/usage.js').UsageData>}
 */
export async function fetchAndNormalizeUsage() {
  const settings = await getSettings();
  let orgId = settings.orgId;

  // Auto-discover orgId if missing
  if (!orgId) {
    logger.info('Org ID not set, attempting auto-discovery');
    const orgs = await getOrganizations();
    
    if (!orgs || orgs.length === 0) {
      throw ErrorFactory.auth('No organizations found for this account.');
    }
    
    // Pick the first org by default
    orgId = orgs[0].uuid || orgs[0].id; 
    
    if (!orgId) {
       throw ErrorFactory.schema('Organization object missing ID field', { raw: orgs[0] });
    }

    logger.info('Auto-discovered Org ID', { orgId });
    await updateSettings({ orgId });
  }

  // Fetch raw data
  const rawData = await getUsageForOrg(orgId);
  
  // Normalize
  const normalizedData = normalizeUsage(rawData, orgId);
  
  // Cache it
  await setUsageCache(normalizedData);
  
  return normalizedData;
}
