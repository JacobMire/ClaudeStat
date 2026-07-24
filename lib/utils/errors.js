/**
 * @fileoverview Custom error classes for typed error handling.
 */

/**
 * Base application error.
 */
export class AppError extends Error {
  /**
   * @param {string} type - 'NETWORK' | 'AUTH' | 'RATE_LIMIT' | 'SCHEMA' | 'STORAGE' | 'UNKNOWN'
   * @param {string} message - Human readable message
   * @param {Object} [meta={}] - Additional context (e.g., status codes, raw response)
   */
  constructor(type, message, meta = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.meta = meta;
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      meta: this.meta,
      stack: this.stack
    };
  }
  
  static fromJSON(json) {
    if (json && json.name === 'AppError') {
      const err = new AppError(json.type, json.message, json.meta);
      err.stack = json.stack;
      return err;
    }
    return new AppError('UNKNOWN', json?.message || 'Unknown error object');
  }
}

/**
 * Factory for common errors.
 */
export const ErrorFactory = {
  network: (message, meta) => new AppError('NETWORK', message, meta),
  auth: (message, meta) => new AppError('AUTH', message, meta),
  rateLimit: (message, meta) => new AppError('RATE_LIMIT', message, meta),
  schema: (message, meta) => new AppError('SCHEMA', message, meta),
  storage: (message, meta) => new AppError('STORAGE', message, meta),
  unknown: (message, meta) => new AppError('UNKNOWN', message, meta),
};
