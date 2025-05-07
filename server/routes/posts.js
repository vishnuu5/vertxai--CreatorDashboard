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
router.get("/feed", getFeedPosts);

// @route   POST /api/posts/save
router.post("/save", savePost);

// @route   GET /api/posts/saved
router.get("/saved", getSavedPosts);

// @route   POST /api/posts/share
router.post("/share", sharePost);

// @route   POST /api/posts/report
router.post("/report", reportPost);

module.exports = router;
