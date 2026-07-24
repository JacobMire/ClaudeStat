/**
 * @fileoverview Theme management utility.
 */

/**
 * Applies the selected theme to the document root.
 * @param {string} theme - 'light', 'dark', or 'system'
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

/**
 * Listens for system theme changes and updates if currently in system mode.
 */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Dynamically import settings to avoid circular dependencies and ensure fresh state
  import('../storage/settings.js').then(({ getSettings }) => {
    getSettings().then(settings => {
      if (settings.theme === 'system') {
        const root = document.documentElement;
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  });
});
