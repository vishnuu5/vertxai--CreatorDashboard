import api from "./api";
import { setLocalStorage, removeLocalStorage } from "../utils/storage";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise with registration result
 */
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Promise with login result
 */
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

/**
 * Get the current user profile
 * @returns {Promise} Promise with user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get user data" };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} Whether the user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
