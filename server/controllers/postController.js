const axios = require("axios");
const Post = require("../models/Post");
const SavedPost = require("../models/SavedPost");
const Report = require("../models/Report");
const Activity = require("../models/Activity");
const CreditTransaction = require("../models/CreditTransaction");
const User = require("../models/User");

// Helper function to get Twitter data
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

// Helper function to get Reddit data
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

// @desc    Get feed posts
// @route   GET /api/posts/feed
// @access  Private
exports.getFeedPosts = async (req, res) => {
  try {
    const { source } = req.query;
    let posts = [];

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
    posts = [...twitterPosts, ...redditPosts];

    // Check if any posts are saved by user
    const savedPosts = await SavedPost.find({ user: req.user._id });
    const savedPostIds = savedPosts.map((p) => p.post.toString());

    // Add saved flag - Fix the issue with finding posts in the database
    posts = posts.map((post) => {
      return {
        ...post,
        id: post.id, // Just use the original id
        saved: false, // Default to not saved
      };
    });

    // Sort by most recent
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(posts);
  } catch (error) {
    console.error("Get feed posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Save a post
// @route   POST /api/posts/save
// @access  Private
exports.savePost = async (req, res) => {
  try {
    // Updated to accept full post data
    const { post: postData } = req.body;

    if (!postData) {
      return res.status(400).json({ message: "Post data is required" });
    }

    // Check if post exists in database by original ID
    let post = await Post.findOne({ originalId: postData.id });

    if (!post) {
      // Create new post in database
      post = await Post.create({
        title: postData.title,
        content: postData.content,
        source: postData.source,
        originalId: postData.id,
        author: postData.author,
        imageUrl: postData.imageUrl,
        likes: postData.likes || 0,
        comments: postData.comments || 0,
      });
    }

    // Check if already saved
    const existingSave = await SavedPost.findOne({
      user: req.user._id,
      post: post._id,
    });

    if (existingSave) {
      return res.status(400).json({ message: "Post already saved" });
    }

    // Save the post
    await SavedPost.create({
      user: req.user._id,
      post: post._id,
    });

    // Add activity
    await Activity.create({
      user: req.user._id,
      type: "post_save",
      data: {
        postId: post._id,
        title: post.title,
      },
    });

    res.status(201).json({ message: "Post saved successfully" });
  } catch (error) {
    console.error("Save post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get saved posts
// @route   GET /api/posts/saved
// @access  Private
exports.getSavedPosts = async (req, res) => {
  try {
    const savedPosts = await SavedPost.find({ user: req.user._id })
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

    res.json(formattedPosts);
  } catch (error) {
    console.error("Get saved posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Share a post
// @route   POST /api/posts/share
// @access  Private
exports.sharePost = async (req, res) => {
  try {
    // Updated to accept full post data
    const { post: postData } = req.body;

    if (!postData) {
      return res.status(400).json({ message: "Post data is required" });
    }

    // Check if post exists in database by original ID
    let post = await Post.findOne({ originalId: postData.id });

    if (!post) {
      // Create new post in database
      post = await Post.create({
        title: postData.title,
        content: postData.content,
        source: postData.source,
        originalId: postData.id,
        author: postData.author,
      });
    }

    // Add activity
    await Activity.create({
      user: req.user._id,
      type: "post_share",
      data: {
        postId: post._id,
      },
    });

    res.json({ message: "Post shared successfully" });
  } catch (error) {
    console.error("Share post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Report a post
// @route   POST /api/posts/report
// @access  Private
exports.reportPost = async (req, res) => {
  try {
    // Updated to accept full post data
    const {
      post: postData,
      reason = "inappropriate",
      description = "",
    } = req.body;

    if (!postData) {
      return res.status(400).json({ message: "Post data is required" });
    }

    // Check if post exists in database by original ID
    let post = await Post.findOne({ originalId: postData.id });

    if (!post) {
      // Create new post in database
      post = await Post.create({
        title: postData.title,
        content: postData.content,
        source: postData.source,
        originalId: postData.id,
        author: postData.author,
        imageUrl: postData.imageUrl,
      });
    }

    // Create report
    await Report.create({
      post: post._id,
      reportedBy: req.user._id,
      reason,
      description,
    });

    // Add activity
    await Activity.create({
      user: req.user._id,
      type: "post_report",
      data: {
        postId: post._id,
        reason,
      },
    });

    res.status(201).json({ message: "Post reported successfully" });
  } catch (error) {
    console.error("Report post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
