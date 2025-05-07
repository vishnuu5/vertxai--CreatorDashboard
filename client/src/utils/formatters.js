
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


export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};


export const truncateString = (str, length = 100) => {
  if (!str) return "";
  if (str.length <= length) return str;

  return str.slice(0, length) + "...";
};


export const formatUsername = (email) => {
  if (!email) return "";
  return email.split("@")[0];
};
