/**
 * Debug Logger Utility
 * Provides environment-aware logging functions
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugEnabled = process.env.REACT_APP_DEBUG_LOGS === 'true' || isDevelopment;

/**
 * Debug logging function - only logs in development or when debug is enabled
 * @param {string} message - Log message
 * @param {any} data - Optional data to log
 */
export const debugLog = (message, data = null) => {
  if (isDebugEnabled) {
    if (data !== null) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
};

/**
 * Error logging function - always logs errors
 * @param {string} message - Error message
 * @param {any} error - Error object or data
 */
export const errorLog = (message, error = null) => {
  if (error !== null) {
    console.error(`[ERROR] ${message}`, error);
  } else {
    console.error(`[ERROR] ${message}`);
  }
};

/**
 * Warning logging function - logs warnings in development
 * @param {string} message - Warning message
 * @param {any} data - Optional data to log
 */
export const warnLog = (message, data = null) => {
  if (isDebugEnabled) {
    if (data !== null) {
      console.warn(`[WARN] ${message}`, data);
    } else {
      console.warn(`[WARN] ${message}`);
    }
  }
};

/**
 * Info logging function - logs info in development
 * @param {string} message - Info message
 * @param {any} data - Optional data to log
 */
export const infoLog = (message, data = null) => {
  if (isDebugEnabled) {
    if (data !== null) {
      console.info(`[INFO] ${message}`, data);
    } else {
      console.info(`[INFO] ${message}`);
    }
  }
};

export default {
  debugLog,
  errorLog,
  warnLog,
  infoLog
};
