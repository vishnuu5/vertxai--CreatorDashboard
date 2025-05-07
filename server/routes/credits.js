const express = require("express");
const router = express.Router();
const {
  addCredits,
  dailyLoginCredit,
  getCreditHistory,
} = require("../controllers/creditController");

// @route   POST /api/credits/add
router.post("/add", addCredits);

// @route   POST /api/credits/daily-login
router.post("/daily-login", dailyLoginCredit);

// @route   GET /api/credits/history
router.get("/history", getCreditHistory);

module.exports = router;
