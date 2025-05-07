const axios = require("axios");
const Post = require("../models/Post");
const SavedPost = require("../models/SavedPost");
const Report = require("../models/Report");
const { ApiError } = require("../utils/errorHandler");
const activityService = require("./activityService");
const creditService = require("./creditService");

/**
 * Get Twitter posts
 * @returns {Array} Twitter posts
 */
const getTwitterPosts = async () => {
  try {
    // This would normally use the Twitter API
    // For this assignment, we'll return mock data
    return [
      {
        id: "tweet1",
        title: "Latest tech news",
        content:
          "Exciting developments in AI and machine learning are transforming industries across the globe.",
        author: "TechNews",
        source: "twitter",
        imageUrl: "https://picsum.photos/600/400?random=1",
        likes: 245,
        comments: 39,
        createdAt: new Date(),
      },
      {
        id: "tweet2",
        title: "Startup funding",
        content:
          "New startup secures $50M in Series B funding to revolutionize renewable energy storage solutions.",
        author: "VentureCapital",
        source: "twitter",
        likes: 127,
        comments: 21,
        createdAt: new Date(),
      },
      // More would be added in a real app
    ];
  } catch (error) {
    console.error("Twitter API error:", error);
    return [];
  }
};

/**
 * Get Reddit posts
 * @returns {Array} Reddit posts
 */
const getRedditPosts = async () => {
  try {
    // This would normally use the Reddit API
    // For this assignment, we'll return mock data
    return [
      {
        id: "reddit1",
        title: "What programming language should I learn in 2023?",
        content:
          "I'm looking to start my programming journey and wondering which language would be most valuable to learn first. Any suggestions?",
        author: "coding_newbie",
        source: "reddit",
        likes: 432,
        comments: 157,
        createdAt: new Date(),
      },
      {
        id: "reddit2",
        title: "My experience working remotely for 3 years",
        content:
          "After working remotely for 3 years, I wanted to share some tips and challenges I've faced along the way...",
        author: "remote_worker",
        source: "reddit",
        imageUrl: "https://picsum.photos/600/400?random=2",
        likes: 876,
        comments: 214,
        createdAt: new Date(),
      },
      // More would be added in a real app
    ];
  } catch (error) {
    console.error("Reddit API error:", error);
    return [];
  }
};

/**
 * Get feed posts
 * @param {string} userId - User ID
 * @param {string} source - Source filter
 * @returns {Array} Feed posts
 */
const getFeedPosts = async (userId, source = "all") => {
  // Get posts from different sources
  let twitterPosts = [];
  let redditPosts = [];

  if (source === "all" || source === "twitter") {
    twitterPosts = await getTwitterPosts();
  }

  if (source === "all" || source === "reddit") {
    redditPosts = await getRedditPosts();
  }

  // Combine posts
  let posts = [...twitterPosts, ...redditPosts];

  // Check if any posts are saved by user
  const savedPosts = await SavedPost.find({ user: userId });
  const savedPostIds = savedPosts.map((p) => p.post.toString());

  // Add saved flag
  posts = posts.map((post) => {
    // Check if post exists in database
    const dbPost = Post.findOne({ originalId: post.id, source: post.source });

    return {
      ...post,
      id: dbPost ? dbPost._id : post.id,
      saved: dbPost ? savedPostIds.includes(dbPost._id.toString()) : false,
    };
  });

  // Sort by most recent
  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return posts;
};

/**
 * Save a post
 * @param {string} userId - User ID
 * @param {string} postId - Post ID
 * @returns {Object} Save result
 */
const savePost = async (userId, postId) => {
  // Check if post exists
  let post = await Post.findById(postId);

  if (!post) {
    // Post might be from mock data, create it
    const mockPosts = await getFeedPosts(userId);
    const postData = mockPosts.find((p) => p.id === postId);

    if (!postData) {
      throw new ApiError(404, "Post not found");
    }

    // Create new post in database
    post = await Post.create({
      title: postData.title,
      content: postData.content,
      source: postData.source,
      originalId: postData.id,
      author: postData.author,
      imageUrl: postData.imageUrl,
      likes: postData.likes,
      comments: postData.comments,
    });
  }

  // Check if already saved
  const existingSave = await SavedPost.findOne({
    user: userId,
    post: post._id,
  });

  if (existingSave) {
    throw new ApiError(400, "Post already saved");
  }

  // Save the post
  await SavedPost.create({
    user: userId,
    post: post._id,
  });

  // Add activity
  await activityService.createActivity(userId, "post_save", {
    postId: post._id,
    title: post.title,
  });

  return { message: "Post saved successfully" };
};

/**
 * Get saved posts
 * @param {string} userId - User ID
 * @returns {Array} Saved posts
 */
const getSavedPosts = async (userId) => {
  const savedPosts = await SavedPost.find({ user: userId })
    .populate("post")
    .sort({ savedAt: -1 });

  // Format for client
  const formattedPosts = savedPosts.map((savedPost) => ({
    id: savedPost.post._id,
    title: savedPost.post.title,
    source: savedPost.post.source,
    author: savedPost.post.author,
    savedAt: savedPost.savedAt,
  }));

  return formattedPosts;
};

/**
 * Share a post
 * @param {string} userId - User ID
 * @param {string} postId - Post ID
 * @returns {Object} Share result
 */
const sharePost = async (userId, postId) => {
  // Add activity
  await activityService.createActivity(userId, "post_share", {
    postId,
  });

  // Award credits
  await creditService.addCredits(userId, 3, "Shared content", "interaction");

  return { message: "Post shared successfully" };
};

/**
 * Report a post
 * @param {string} userId - User ID
 * @param {string} postId - Post ID
 * @param {string} reason - Report reason
 * @param {string} description - Report description
 * @returns {Object} Report result
 */
const reportPost = async (
  userId,
  postId,
  reason = "inappropriate",
  description = ""
) => {
  // Check if post exists
  let post = await Post.findById(postId);

  if (!post) {
    // Post might be from mock data, create it
    const mockPosts = await getFeedPosts(userId);
    const postData = mockPosts.find((p) => p.id === postId);

    if (!postData) {
      throw new ApiError(404, "Post not found");
    }

    // Create new post in database
    post = await Post.create({
      title: postData.title,
      content: postData.content,
      source: postData.source,
      originalId: postData.id,
      author: postData.author,
      imageUrl: postData.imageUrl,
      likes: postData.likes,
      comments: postData.comments,
    });
  }

  // Create report
  await Report.create({
    post: post._id,
    reportedBy: userId,
    reason,
    description,
  });

  // Add activity
  await activityService.createActivity(userId, "post_report", {
    postId: post._id,
    reason,
  });

  return { message: "Post reported successfully" };
};

module.exports = {
  getFeedPosts,
  savePost,
  getSavedPosts,
  sharePost,
  reportPost,
};
