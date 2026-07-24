/**
 * @fileoverview Base authenticated API client for Claude.ai.
 * Handles fetch, timeout, error mapping, and credentials.
 */

import { logger } from '../utils/logger.js';
import { ErrorFactory } from '../utils/errors.js';
import { MOCK_MODE } from '../utils/constants.js';
import { getMockResponse } from './mock.js';

/**
 * Base fetch wrapper for the Claude API.
 * @param {string} url - The complete URL to fetch.
 * @param {Object} [options={}] - Fetch options.
 * @param {number} [timeoutMs=10000] - Request timeout in milliseconds.
 * @returns {Promise<Object>} The parsed JSON response.
 */
export async function apiFetch(url, options = {}, timeoutMs = 10000) {
  if (MOCK_MODE) {
    logger.info(`[MOCK] Intercepting request to ${url}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockResponse(url)), 500); // 500ms simulated latency
    });
  }
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const fetchOptions = {
    ...options,
    credentials: 'include', // CRITICAL: Uses existing claude.ai session cookies
    signal: controller.signal,
    headers: {
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  try {
    logger.debug(`Fetching ${url}`);
    const response = await fetch(url, fetchOptions);
    clearTimeout(id);

    if (!response.ok) {
      await _handleHttpError(response);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(id);
    
    if (error.name === 'AbortError') {
      throw ErrorFactory.network('Request timed out', { url });
    }
    
    // If it's already one of our custom AppErrors, rethrow it
    if (error.name === 'AppError') {
      throw error;
    }

    logger.error('Fetch failed', { url, message: error.message });
    throw ErrorFactory.network('Network request failed', { url, originalError: error.message });
  }
}

/**
 * Parses HTTP status codes into structured AppErrors.
 * @param {Response} response - The failed fetch response.
 */
async function _handleHttpError(response) {
  const status = response.status;
  let responseBody = {};
  
  try {
    responseBody = await response.json();
  } catch {
    // Response might not be JSON, ignore.
  }

  const meta = { status, url: response.url, responseBody };

  if (status === 401 || status === 403) {
    throw ErrorFactory.auth('Not logged in or session expired', meta);
  }
  
  if (status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    if (retryAfter) meta.retryAfter = parseInt(retryAfter, 10);
    throw ErrorFactory.rateLimit('Rate limited', meta);
  }

  throw ErrorFactory.network(`HTTP Error ${status}`, meta);
}
