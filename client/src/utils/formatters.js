/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const dateObj = date instanceof Date ? date : new Date(date);

  const defaultOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  };

  return dateObj.toLocaleDateString("en-US", defaultOptions);
};

/**
 * Format a number to a readable string with commas
 * @param {number} number - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Format a number to a currency string
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - The maximum length
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 100) => {
  if (!str) return "";
  if (str.length <= length) return str;

  return str.slice(0, length) + "...";
};

/**
 * Format a username from an email
 * @param {string} email - The email to format
 * @returns {string} Formatted username
 */
export const formatUsername = (email) => {
  if (!email) return "";
  return email.split("@")[0];
};
