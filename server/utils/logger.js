/**
 * Simple logger utility
 */
const logger = {
  /**
   * Log info message
   * @param {string} message - Message to log
   * @param {Object} data - Additional data
   */
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },

  /**
   * Log error message
   * @param {string} message - Message to log
   * @param {Error|Object} error - Error object
   */
  error: (message, error = {}) => {
    console.error(`[ERROR] ${message}`, error);
  },

  /**
   * Log warning message
   * @param {string} message - Message to log
   * @param {Object} data - Additional data
   */
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  },

  /**
   * Log debug message (only in development)
   * @param {string} message - Message to log
   * @param {Object} data - Additional data
   */
  debug: (message, data = {}) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

  /**
   * Log request details
   * @param {Object} req - Express request object
   */
  request: (req) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
    }
  },
};

module.exports = logger;
