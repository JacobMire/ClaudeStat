/**
 * @fileoverview JSDoc type definitions for the canonical data models.
 * This file contains no runtime logic, only type documentation to ensure
 * structure consistency across the extension.
 */

/**
 * The canonical usage data structure returned by the normalizer.
 * All UI code depends STRICTLY on this shape, insulating it from API changes.
 * @typedef {Object} UsageData
 * @property {string} orgId - The Organization ID this usage belongs to
 * @property {string} orgName - The display name of the Organization
 * @property {number} fiveHourPct - 5-hour rolling usage percentage from 0 to 100
 * @property {string} fiveHourResetAt - ISO 8601 timestamp for the 5-hour limit reset
 * @property {number} weeklyPct - 7-day rolling usage percentage from 0 to 100
 * @property {string} weeklyResetAt - ISO 8601 timestamp for the 7-day limit reset
 * @property {number} fetchedAt - Epoch timestamp of when this data was retrieved
 * @property {number} schemaVersion - Internal version number of the normalizer
 */

// Export empty object to make this a valid ES module if imported directly.
export default {};
