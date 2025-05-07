const express = require("express");
const router = express.Router();
const {
  getCurrentUser,
  getUserProfile,
  updateProfile,
} = require("../controllers/userController");

// @route   GET /api/users/me
router.get("/me", getCurrentUser);

// @route   GET /api/users/profile
router.get("/profile", getUserProfile);

// @route   PUT /api/users/profile
router.put("/profile", updateProfile);

module.exports = router;
