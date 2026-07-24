/**
 * @fileoverview Handles messages sent from the Popup and Settings to the Service Worker.
 */

import { logger } from '../lib/utils/logger.js';
import { fetchAndNormalizeUsage } from '../lib/repository/usageRepository.js';

/**
 * Main message listener.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  logger.debug('Received message', { action: request.action });

  if (request.action === 'FETCH_USAGE') {
    handleFetchUsage(sendResponse);
    return true; // Indicates asynchronous response
  }

  return false; // Sync return for unrecognized messages
});

async function handleFetchUsage(sendResponse) {
  try {
    const data = await fetchAndNormalizeUsage();
    sendResponse({ success: true, data });
  } catch (error) {
    logger.error('Fetch usage action failed', { error });
    // Errors must be plain objects to cross the message boundary
    sendResponse({ success: false, error: error.toJSON ? error.toJSON() : { message: error.message, type: 'UNKNOWN' } });
  }
}
