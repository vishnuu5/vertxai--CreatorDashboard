import api from "./api";


export const getFeedPosts = async (source = "all") => {
  try {
    const response = await api.get(`/posts/feed?source=${source}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get feed posts" };
  }
};


export const savePost = async (postId) => {
  try {
    const response = await api.post("/posts/save", { postId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to save post" };
  }
};


export const getSavedPosts = async () => {
  try {
    const response = await api.get("/posts/saved");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get saved posts" };
  }
};


export const sharePost = async (post) => {
  try {
    const response = await api.post("/posts/share", { postId: post.id });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to share post" };
  }
};


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
