const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");
const Report = require("../models/Report");
const Post = require("../models/Post");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get stats
    const userCount = await User.countDocuments();

    const totalCredits = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$credits" } } },
    ]);

    const reportedPosts = await Report.countDocuments({ status: "pending" });

    res.json({
      userCount,
      totalCredits: totalCredits.length > 0 ? totalCredits[0].total : 0,
      reportedPosts,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user credits
// @route   POST /api/admin/credits
// @access  Private/Admin
exports.updateUserCredits = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate input
    if (!userId || !amount) {
      return res
        .status(400)
        .json({ message: "userId and amount are required" });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update credits
    user.credits += amount;

    // Ensure credits don't go negative
    if (user.credits < 0) {
      user.credits = 0;
    }

    await user.save();

    // Record transaction
    await CreditTransaction.create({
      user: user._id,
      amount,
      balance: user.credits,
      type: "admin_adjustment",
      reason: reason || "Admin adjustment",
    });

    res.json({
      message: "Credits updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Update user credits error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get reported content
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReportedContent = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const reports = await Report.find({ status: "pending" })
      .populate("post")
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error("Get reported content error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Resolve a report
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private/Admin
exports.resolveReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update report status
    report.status = "resolved";
    await report.save();

    res.json({ message: "Report resolved successfully" });
  } catch (error) {
    console.error("Resolve report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
