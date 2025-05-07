const express = require("express");
const router = express.Router();
const { getRecentActivity } = require("../controllers/activityController");

// @route   GET /api/activity/recent
// @desc    Get recent activity
// @access  Private
router.get("/recent", getRecentActivity);

module.exports = router;
