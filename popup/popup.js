/**
 * @fileoverview Main entry point for the popup UI.
 * Orchestrates fetching, caching, and rendering.
 */

import { logger } from '../lib/utils/logger.js';
import { applyTheme } from '../lib/ui/theme.js';
import { getSettings } from '../lib/storage/settings.js';
import { renderSkeleton, renderUsage, renderError, setContentState } from '../lib/ui/renderer.js';
import { getUsageCache } from '../lib/storage/cache.js';
import { getMsRemaining, formatDuration } from '../lib/utils/time.js';
import { countUp } from '../lib/ui/animations.js';

let currentSettings = null;
let countdownInterval = null;
let hasRenderedUsage = false;

async function init() {
  logger.info('Popup initialized');
  
  // Apply theme and animation settings immediately
  currentSettings = await getSettings();
  applyTheme(currentSettings.theme);
  
  if (currentSettings.animationsEnabled === false) {
    document.body.classList.add('reduced-motion');
  }

  // Setup listeners
  document.getElementById('btn-refresh').addEventListener('click', handleRefresh);
  document.getElementById('btn-settings').addEventListener('click', openSettings);
  document.getElementById('btn-close-settings').addEventListener('click', closeSettings);

  window.addEventListener('beforeunload', cleanup);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      cleanup();
    }
  });

  // Initial load
  await loadData();
}

async function loadData(forceRefresh = false) {
  // 1. Try Cache First
  const cachedData = await getUsageCache();
  
  if (cachedData) {
    logger.debug('Rendering from cache first', { isStale: cachedData.isStale });
    _renderAndAnimate(cachedData);
    
    // If we have fresh cache and it's not a manual refresh, we can skip fetching
    if (!cachedData.isStale && !forceRefresh) {
      logger.info('Cache is fresh, skipping network fetch');
      return;
    }
  } else {
    setContentState('skeleton');
    renderSkeleton();
  }

  // 2. Fetch Fresh Data via Service Worker Messaging
  logger.debug('Dispatching FETCH_USAGE to Service Worker');
  
  chrome.runtime.sendMessage({ action: 'FETCH_USAGE' }, (response) => {
    if (chrome.runtime.lastError) {
      logger.error('Message failed', { error: chrome.runtime.lastError });
      renderError({ message: 'Extension communication error. Try reloading.', type: 'UNKNOWN' }, cachedData);
      setContentState('error');
      return;
    }

    if (response && response.success) {
      logger.info('Received fresh data from SW');
      _renderAndAnimate(response.data);
    } else {
      logger.warn('Received error from SW', { error: response?.error });
      renderError(response?.error, cachedData);
      setContentState('error');
    }
  });
}

function _renderAndAnimate(data) {
  renderUsage(data, null, hasRenderedUsage);
  setContentState('usage');
  startCountdown();

  // Trigger animations
  const counters = document.querySelectorAll('.count-up');
  counters.forEach(counter => {
    const target = Number(counter.getAttribute('data-target'));
    if (hasRenderedUsage) {
      counter.textContent = target;
    } else {
      countUp(counter, target);
    }
  });

  hasRenderedUsage = true;
}

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const timers = document.querySelectorAll('.model-timer');
    timers.forEach(el => {
      const resetStr = el.getAttribute('data-reset');
      if (resetStr) {
        el.textContent = formatDuration(getMsRemaining(resetStr));
      } else {
        el.textContent = '0s';
      }
    });
  }, 1000);
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
    logger.debug('Countdown interval cleared on unmount');
  }
}

function handleRefresh() {
  logger.debug('Manual refresh triggered');
  loadData(true);
}

function openSettings() {
  document.getElementById('settings-panel').classList.add('open');
  
  // Lazy load settings UI
  import('../settings/settings.js').then(({ initSettingsUI }) => {
    initSettingsUI();
  });
}

function closeSettings() {
  document.getElementById('settings-panel').classList.remove('open');
  // Refresh data on close in case settings (like Org ID) changed
  loadData();
}

function cleanup() {
  logger.debug('Cleaning up popup resources');
  stopCountdown();
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
