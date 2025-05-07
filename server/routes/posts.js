const express = require("express");
const router = express.Router();
const {
  getFeedPosts,
  savePost,
  getSavedPosts,
  sharePost,
  reportPost,
} = require("../controllers/postController");

// @route   GET /api/posts/feed
// @desc    Get feed posts
// @access  Private
router.get("/feed", getFeedPosts);

// @route   POST /api/posts/save
// @desc    Save a post
// @access  Private
router.post("/save", savePost);

// @route   GET /api/posts/saved
// @desc    Get saved posts
// @access  Private
router.get("/saved", getSavedPosts);

// @route   POST /api/posts/share
// @desc    Share a post
// @access  Private
router.post("/share", sharePost);

// @route   POST /api/posts/report
// @desc    Report a post
// @access  Private
router.post("/report", reportPost);

module.exports = router;
