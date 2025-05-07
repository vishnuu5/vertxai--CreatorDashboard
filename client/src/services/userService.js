import api from "./api";

/**
 * Get user profile
 * @returns {Promise} Promise with user profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get profile" };
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Promise with updated profile
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update profile" };
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @returns {Promise} Promise with result
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put("/users/password", passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to change password" };
  }
};

/**
 * Delete user account
 * @returns {Promise} Promise with result
 */
export const deleteAccount = async () => {
  try {
    const response = await api.delete("/users/account");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete account" };
  }
};
