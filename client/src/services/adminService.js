import api from "./api";

/**
 * Get admin dashboard stats
 * @returns {Promise} Promise with admin stats
 */
export const getAdminStats = async () => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get admin stats" };
  }
};

/**
 * Get all users
 * @returns {Promise} Promise with users list
 */
export const getUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get users" };
  }
};

/**
 * Update user credits
 * @param {string} userId - User ID
 * @param {number} amount - Amount of credits to add/remove
 * @param {string} reason - Reason for adjustment
 * @returns {Promise} Promise with result
 */
export const updateUserCredits = async (userId, amount, reason) => {
  try {
    const response = await api.post("/admin/credits", {
      userId,
      amount,
      reason,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update user credits" };
  }
};

/**
 * Get reported content
 * @returns {Promise} Promise with reported content
 */
export const getReportedContent = async () => {
  try {
    const response = await api.get("/admin/reports");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get reported content" };
  }
};

/**
 * Resolve a report
 * @param {string} reportId - Report ID
 * @returns {Promise} Promise with result
 */
export const resolveReport = async (reportId) => {
  try {
    const response = await api.put(`/admin/reports/${reportId}/resolve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to resolve report" };
  }
};
