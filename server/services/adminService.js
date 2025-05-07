const User = require("../models/User");
const Report = require("../models/Report");
const { ApiError } = require("../utils/errorHandler");
const creditService = require("./creditService");

/**
 * Get admin dashboard stats
 * @returns {Object} Admin stats
 */
const getAdminStats = async () => {
  // Get stats
  const userCount = await User.countDocuments();

  const totalCredits = await User.aggregate([
    { $group: { _id: null, total: { $sum: "$credits" } } },
  ]);

  const reportedPosts = await Report.countDocuments({ status: "pending" });

  return {
    userCount,
    totalCredits: totalCredits.length > 0 ? totalCredits[0].total : 0,
    reportedPosts,
  };
};

/**
 * Get all users
 * @returns {Array} Users list
 */
const getUsers = async () => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return users;
};

/**
 * Update user credits
 * @param {string} adminId - Admin user ID
 * @param {string} userId - Target user ID
 * @param {number} amount - Amount of credits to add/remove
 * @param {string} reason - Reason for adjustment
 * @returns {Object} Updated user
 */
const updateUserCredits = async (adminId, userId, amount, reason) => {
  // Validate input
  if (!userId || !amount) {
    throw new ApiError(400, "userId and amount are required");
  }

  // Find user
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Add credits
  await creditService.addCredits(
    userId,
    amount,
    reason || "Admin adjustment",
    "admin_adjustment"
  );

  // Get updated user
  const updatedUser = await User.findById(userId);

  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    credits: updatedUser.credits,
  };
};

/**
 * Get reported content
 * @returns {Array} Reported content
 */
const getReportedContent = async () => {
  const reports = await Report.find({ status: "pending" })
    .populate("post")
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 });

  return reports;
};

/**
 * Resolve a report
 * @param {string} reportId - Report ID
 * @returns {Object} Resolve result
 */
const resolveReport = async (reportId) => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  // Update report status
  report.status = "resolved";
  await report.save();

  return { message: "Report resolved successfully" };
};

module.exports = {
  getAdminStats,
  getUsers,
  updateUserCredits,
  getReportedContent,
  resolveReport,
};
