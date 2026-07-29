/**
 * @fileoverview Time utilities for countdowns and duration formatting.
 */

/**
 * Formats a duration in milliseconds into a human-readable string.
 * @param {number} ms - Duration in milliseconds.
 * @returns {string} Formatted string (e.g., "4h 32m", "45m", "15s").
 */
export function formatDuration(ms) {
  if (ms <= 0) return '0s';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Calculates milliseconds remaining until a target ISO date.
 * @param {string} isoDate - Target date in ISO 8601 format.
 * @returns {number} Milliseconds remaining, or 0 if past.
 */
export function getMsRemaining(isoDate) {
  if (!isoDate) return 0;
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.max(0, target - now);
}

/**
 * Formats an ISO date into a localized time string (e.g., "4:50 PM" or "Mon, 4:50 PM").
 * @param {string} isoDate - Target date in ISO 8601 format.
 * @returns {string} Formatted time string.
 */
export function formatResetTime(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  
  const isFar = getMsRemaining(isoDate) > 24 * 60 * 60 * 1000;
  const options = { hour: 'numeric', minute: '2-digit' };
  if (isFar) {
    options.weekday = 'short';
  }
  
  return date.toLocaleString([], options);
}
