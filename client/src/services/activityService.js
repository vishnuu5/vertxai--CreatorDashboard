import api from "./api";

/**
 * Get recent activity
 * @returns {Promise} Promise with recent activity
 */
export const getRecentActivity = async () => {
  try {
    const response = await api.get("/activity/recent");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get recent activity" };
  }
};

/**
 * Track user activity
 * @param {string} type - Activity type
 * @param {Object} data - Activity data
 * @returns {Promise} Promise with result
 */
export const trackActivity = async (type, data = {}) => {
  try {
    const response = await api.post("/activity/track", { type, data });
    return response.data;
  } catch (error) {
    // Silently fail for tracking errors
    console.error("Failed to track activity:", error);
    return null;
  }
};
