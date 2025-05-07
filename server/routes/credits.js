const express = require("express");
const router = express.Router();
const {
  addCredits,
  dailyLoginCredit,
  getCreditHistory,
} = require("../controllers/creditController");

// @route   POST /api/credits/add
// @desc    Add credits to user
// @access  Private
router.post("/add", addCredits);

// @route   POST /api/credits/daily-login
// @desc    Award daily login credit
// @access  Private
router.post("/daily-login", dailyLoginCredit);

// @route   GET /api/credits/history
// @desc    Get credit history
// @access  Private
router.get("/history", getCreditHistory);

module.exports = router;
