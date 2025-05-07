import api from "./api";


export const getAdminStats = async () => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get admin stats" };
  }
};


export const getUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get users" };
  }
};


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


export const getReportedContent = async () => {
  try {
    const response = await api.get("/admin/reports");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get reported content" };
  }
};


export const resolveReport = async (reportId) => {
  try {
    const response = await api.put(`/admin/reports/${reportId}/resolve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to resolve report" };
  }
};
