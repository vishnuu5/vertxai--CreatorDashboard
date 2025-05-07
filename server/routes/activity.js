const express = require("express");
const router = express.Router();
const { getRecentActivity } = require("../controllers/activityController");

// @route   GET /api/activity/recen
router.get("/recent", getRecentActivity);

module.exports = router;
