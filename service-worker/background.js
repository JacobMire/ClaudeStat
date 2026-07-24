/**
 * @fileoverview Main entry point for the Manifest V3 Service Worker.
 */

import { logger } from '../lib/utils/logger.js';
import './messageHandler.js'; // Attach the message listeners

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    logger.info('Claude Usage Monitor extension installed.');
  } else if (details.reason === 'update') {
    logger.info('Claude Usage Monitor extension updated.', { previousVersion: details.previousVersion });
  }
});
