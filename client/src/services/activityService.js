import api from "./api";

export const getRecentActivity = async () => {
  try {
    const response = await api.get("/activity/recent");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get recent activity" };
  }
};


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
