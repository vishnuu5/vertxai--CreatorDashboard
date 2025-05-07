const express = require("express");
const router = express.Router();
const {
  getCurrentUser,
  getUserProfile,
  updateProfile,
} = require("../controllers/userController");

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", getCurrentUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", updateProfile);

module.exports = router;
