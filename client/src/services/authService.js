import api from "./api";
import { setLocalStorage, removeLocalStorage } from "../utils/storage";


export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};


export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token } = response.data;

    // Save token to localStorage
    setLocalStorage("token", token);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

/**
 * Logout the current user
 */
export const logout = () => {
  // Remove token from localStorage
  removeLocalStorage("token");
};


export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get user data" };
  }
};


export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
