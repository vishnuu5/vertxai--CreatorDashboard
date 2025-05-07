import api from "./api";


export const addCredits = async (amount, reason) => {
  try {
    const response = await api.post("/credits/add", { amount, reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add credits" };
  }
};


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


export const getCreditHistory = async () => {
  try {
    const response = await api.get("/credits/history");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get credit history" };
  }
};
