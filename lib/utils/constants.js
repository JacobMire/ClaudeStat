/**
 * @fileoverview Centralized constants for the application.
 */

export const STORAGE_KEYS = {
  USAGE_CACHE: 'usage_cache',
  SETTINGS: 'settings',
  SCHEMA_VERSION: 'schema_v',
};

export const API_PATHS = {
  BASE_URL: 'https://claude.ai',
  ORGANIZATIONS: '/api/organizations',
  USAGE: (orgId) => `/api/organizations/${orgId}/usage`,
};

export const DEFAULT_SETTINGS = {
  orgId: null, // null means we should auto-discover
  theme: 'system', // 'dark', 'light', 'system'
  animationsEnabled: true,
  schemaVersion: 2,
};

export const MOCK_MODE = false; // Set to true for local data layer testing

export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};
