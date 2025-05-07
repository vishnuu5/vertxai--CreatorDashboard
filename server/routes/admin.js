const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUserCredits,
  getReportedContent,
  resolveReport,
} = require("../controllers/adminController");
const { isAdmin } = require("../middleware/auth");

// Apply admin middleware to all routes
router.use(isAdmin);

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get("/stats", getAdminStats);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get("/users", getUsers);

// @route   POST /api/admin/credits
// @desc    Update user credits
// @access  Private/Admin
router.post("/credits", updateUserCredits);

// @route   GET /api/admin/reports
// @desc    Get reported content
// @access  Private/Admin
router.get("/reports", getReportedContent);

// @route   PUT /api/admin/reports/:id/resolve
// @desc    Resolve a report
// @access  Private/Admin
router.put("/reports/:id/resolve", resolveReport);

module.exports = router;
