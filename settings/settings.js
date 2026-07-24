/**
 * @fileoverview Settings UI logic.
 */

import { getSettings, updateSettings } from '../lib/storage/settings.js';
import { clearUsageCache } from '../lib/storage/cache.js';
import { applyTheme } from '../lib/ui/theme.js';
import { logger } from '../lib/utils/logger.js';
import { getSettingsHtml } from './settings.html.js';

let initialized = false;

export async function initSettingsUI() {
  if (initialized) return;

  const container = document.getElementById('settings-content');
  if (!container) return;

  // Inject HTML
  const manifest = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) 
    ? chrome.runtime.getManifest() 
    : { version: '1.0.0' };
  container.innerHTML = getSettingsHtml(manifest.version);

  const selectTheme = document.getElementById('select-theme');
  const inputOrgId = document.getElementById('input-org-id');
  const btnClearCache = document.getElementById('btn-clear-cache');
  const toggleAnimations = document.getElementById('toggle-animations');

  // Load current settings
  const settings = await getSettings();
  selectTheme.value = settings.theme;
  inputOrgId.value = settings.orgId || '';
  toggleAnimations.checked = settings.animationsEnabled;

  // Event Listeners
  selectTheme.addEventListener('change', async (e) => {
    const theme = e.target.value;
    await updateSettings({ theme });
    applyTheme(theme);
  });
  
  toggleAnimations.addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await updateSettings({ animationsEnabled: enabled });
    if (!enabled) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  });

  // Handle Org ID change gracefully
  let debounceTimer;
  inputOrgId.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const val = e.target.value.trim();
      const orgId = val === '' ? null : val;
      
      // Compare without fetching settings again to save I/O
      await updateSettings({ orgId });
      await clearUsageCache(); // Force refresh on next open
      logger.info('Org ID updated, cache cleared', { orgId });
    }, 500);
  });

  btnClearCache.addEventListener('click', async () => {
    await clearUsageCache();
    logger.info('Cache cleared manually by user');
    const originalText = btnClearCache.textContent;
    btnClearCache.textContent = 'Cleared!';
    setTimeout(() => { btnClearCache.textContent = originalText; }, 1500);
  });

  initialized = true;
}
