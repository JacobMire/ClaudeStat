/**
 * @fileoverview Repository for managing cached usage data in chrome.storage.local.
 */

import { STORAGE_KEYS, DEFAULT_SETTINGS, CACHE_TTL_MS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';
import { ErrorFactory } from '../utils/errors.js';

/**
 * Retrieves the cached canonical UsageData.
 * @returns {Promise<import('../models/usage.js').UsageData | null>} The cached data, or null if invalid/missing.
 */
export async function getUsageCache() {
  try {
    const data = await chrome.storage.local.get(STORAGE_KEYS.USAGE_CACHE);
    const cache = data[STORAGE_KEYS.USAGE_CACHE];
    
    if (!cache) {
      logger.debug('Usage cache miss');
      return null;
    }

    // Schema Validation / Migration Check
    if (cache.schemaVersion !== DEFAULT_SETTINGS.schemaVersion) {
      logger.warn('Cache schema version mismatch. Discarding stale cache.', {
        found: cache.schemaVersion,
        expected: DEFAULT_SETTINGS.schemaVersion
      });
      await clearUsageCache();
      return null;
    }

    // Stale Cache Handling - Check TTL
    const ageMs = Date.now() - (cache.fetchedAt || 0);
    if (ageMs > CACHE_TTL_MS) {
      logger.debug('Usage cache hit, but data is stale', { ageMs });
      // We still return it for instant UI rendering, but the caller will trigger a background fetch.
      cache.isStale = true;
    } else {
      logger.debug('Usage cache hit (fresh)', { fetchedAt: cache.fetchedAt });
      cache.isStale = false;
    }

    return cache;
  } catch (error) {
    logger.error('Failed to get usage cache', { error: error.message });
    throw ErrorFactory.storage('Failed to retrieve usage cache', { originalError: error.message });
  }
}

/**
 * Saves canonical UsageData to the cache.
 * @param {import('../models/usage.js').UsageData} usageData - The normalized usage data to cache.
 * @returns {Promise<void>}
 */
export async function setUsageCache(usageData) {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.USAGE_CACHE]: usageData });
    logger.debug('Usage cache updated', { orgId: usageData.orgId });
  } catch (error) {
    logger.error('Failed to set usage cache', { error: error.message });
    throw ErrorFactory.storage('Failed to update usage cache', { originalError: error.message });
  }
}

/**
 * Clears the usage cache.
 * @returns {Promise<void>}
 */
export async function clearUsageCache() {
  try {
    await chrome.storage.local.remove(STORAGE_KEYS.USAGE_CACHE);
    logger.info('Usage cache cleared');
  } catch (error) {
    logger.error('Failed to clear usage cache', { error: error.message });
    throw ErrorFactory.storage('Failed to clear usage cache', { originalError: error.message });
  }
}
