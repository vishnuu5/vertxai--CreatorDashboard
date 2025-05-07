import api from "./api";

/**
 * Get feed posts
 * @param {string} source - Source filter (all, twitter, reddit)
 * @returns {Promise} Promise with feed posts
 */
export const getFeedPosts = async (source = "all") => {
  try {
    const response = await api.get(`/posts/feed?source=${source}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get feed posts" };
  }
};

/**
 * Save a post
 * @param {string} postId - ID of the post to save
 * @returns {Promise} Promise with result
 */
export const savePost = async (postId) => {
  try {
    const response = await api.post("/posts/save", { postId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to save post" };
  }
};

/**
 * Get saved posts
 * @returns {Promise} Promise with saved posts
 */
export const getSavedPosts = async () => {
  try {
    const response = await api.get("/posts/saved");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get saved posts" };
  }
};

/**
 * Share a post
 * @param {Object} post - Post to share
 * @returns {Promise} Promise with result
 */
export const sharePost = async (post) => {
  try {
    const response = await api.post("/posts/share", { postId: post.id });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to share post" };
  }
};

/**
 * Report a post
 * @param {string} postId - ID of the post to report
 * @param {string} reason - Reason for reporting
 * @param {string} description - Additional description
 * @returns {Promise} Promise with result
 */
export const reportPost = async (
  postId,
  reason = "inappropriate",
  description = ""
) => {
  try {
    const response = await api.post("/posts/report", {
      postId,
      reason,
      description,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to report post" };
  }
};
