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
