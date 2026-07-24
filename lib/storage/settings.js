/**
 * @fileoverview Repository for managing user settings in chrome.storage.local.
 */

import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants.js';
import { logger } from '../utils/logger.js';
import { ErrorFactory } from '../utils/errors.js';

/**
 * Retrieves the current user settings.
 * @returns {Promise<Object>} The settings object, merged with defaults.
 */
export async function getSettings() {
  try {
    const data = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
    const settings = data[STORAGE_KEYS.SETTINGS] || {};
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch (error) {
    logger.error('Failed to get settings', { error: error.message });
    throw ErrorFactory.storage('Failed to retrieve settings', { originalError: error.message });
  }
}

/**
 * Updates user settings.
 * @param {Object} partialSettings - Subset of settings to update.
 * @returns {Promise<Object>} The updated settings object.
 */
export async function updateSettings(partialSettings) {
  try {
    const currentSettings = await getSettings();
    const newSettings = { ...currentSettings, ...partialSettings };
    await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: newSettings });
    logger.info('Settings updated', newSettings);
    return newSettings;
  } catch (error) {
    logger.error('Failed to update settings', { error: error.message, partialSettings });
    throw ErrorFactory.storage('Failed to update settings', { originalError: error.message });
  }
}
