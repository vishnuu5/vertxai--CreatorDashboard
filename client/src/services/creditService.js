import api from "./api";

/**
 * Add credits to user
 * @param {number} amount - Amount of credits to add
 * @param {string} reason - Reason for adding credits
 * @returns {Promise} Promise with result
 */
export const addCredits = async (amount, reason) => {
  try {
    const response = await api.post("/credits/add", { amount, reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add credits" };
  }
};

/**
 * Get daily login credit
 * @returns {Promise} Promise with result
 */
export const getDailyLoginCredit = async () => {
  try {
    const response = await api.post("/credits/daily-login");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to get daily login credit" }
    );
  }
};

/**
 * Get credit history
 * @returns {Promise} Promise with credit history
 */
export const getCreditHistory = async () => {
  try {
    const response = await api.get("/credits/history");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get credit history" };
  }
};
