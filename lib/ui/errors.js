/**
 * @fileoverview Renders premium error and empty states.
 */

export function getErrorHtml(error, hasCachedData) {
  const isNetwork = error?.type === 'NETWORK';
  const isAuth = error?.type === 'AUTH';
  
  let title = 'Something went wrong';
  let message = error?.message || 'Unable to load usage data.';
  let icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  let actionHtml = '';

  if (isAuth) {
    title = 'Authentication Required';
    message = 'Please log into your Claude.ai account to monitor usage.';
    icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
    actionHtml = `<button class="btn-primary" onclick="window.open('https://claude.ai', '_blank')" style="margin-top: 8px;">Open Claude.ai</button>`;
  } else if (isNetwork) {
    title = 'Offline Mode';
    message = 'Unable to reach Claude.ai. Check your connection.';
    icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l22 22"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`;
  } else if (error?.type === 'RATE_LIMIT') {
    title = 'Rate Limited';
    message = error.meta?.retryAfter ? `Please try again in ${error.meta.retryAfter} seconds.` : 'Too many requests.';
  }

  return `
    <div class="empty-state animate-enter">
      <div class="empty-icon" style="color: var(--error);">${icon}</div>
      <div class="empty-title">${title}</div>
      <div class="empty-subtitle">${message}</div>
      ${actionHtml}
    </div>
  `;
}
