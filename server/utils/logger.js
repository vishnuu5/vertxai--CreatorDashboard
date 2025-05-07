
const logger = {
  
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },

 
  error: (message, error = {}) => {
    console.error(`[ERROR] ${message}`, error);
  },

 
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  },

 
  debug: (message, data = {}) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

 
  request: (req) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
    }
  },
};

module.exports = logger;
