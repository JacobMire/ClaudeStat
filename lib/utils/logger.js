/**
 * @fileoverview Structured logging utility.
 */

import { LOG_LEVELS } from './constants.js';

class Logger {
  constructor() {
    // Default log level. Can be adjusted via settings if desired.
    this.currentLevel = LOG_LEVELS.DEBUG; 
  }

  /**
   * Sets the minimum log level to output.
   * @param {number} level - A value from LOG_LEVELS.
   */
  setLevel(level) {
    this.currentLevel = level;
  }

  /**
   * Internal formatting function for logs.
   * @param {string} levelName - 'DEBUG', 'INFO', etc.
   * @param {string} message - Main log message.
   * @param {Object} [meta] - Additional context.
   */
  _log(levelName, message, meta) {
    const timestamp = new Date().toISOString();
    const formattedMeta = meta ? JSON.stringify(meta) : '';
    const logStr = `[${timestamp}] [${levelName}] ${message} ${formattedMeta}`;
    
    switch (levelName) {
      case 'DEBUG':
        console.debug(logStr, meta || '');
        break;
      case 'INFO':
        console.info(logStr, meta || '');
        break;
      case 'WARN':
        console.warn(logStr, meta || '');
        break;
      case 'ERROR':
        console.error(logStr, meta || '');
        break;
    }
  }

  debug(message, meta) {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) this._log('DEBUG', message, meta);
  }

  info(message, meta) {
    if (this.currentLevel <= LOG_LEVELS.INFO) this._log('INFO', message, meta);
  }

  warn(message, meta) {
    if (this.currentLevel <= LOG_LEVELS.WARN) this._log('WARN', message, meta);
  }

  error(message, meta) {
    if (this.currentLevel <= LOG_LEVELS.ERROR) this._log('ERROR', message, meta);
  }
}

export const logger = new Logger();
