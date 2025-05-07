const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");
const Activity = require("../models/Activity");

// @desc    Add credits to user
// @route   POST /api/credits/add
// @access  Private
exports.addCredits = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid credit amount" });
    }

    // Update user's credits
    const user = await User.findById(req.user._id);
    user.credits += amount;
    await user.save();

    // Record transaction
    await CreditTransaction.create({
      user: user._id,
      amount,
      balance: user.credits,
      type: "interaction",
      reason: reason || "Interaction reward",
    });

    // Record activity
    await Activity.create({
      user: user._id,
      type: "credit_earned",
      data: {
        amount,
        reason,
        newBalance: user.credits,
      },
    });

    res.json({
      message: "Credits added successfully",
      credits: user.credits,
    });
  } catch (error) {
    console.error("Add credits error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Daily login credit
// @route   POST /api/credits/daily-login
// @access  Private
exports.dailyLoginCredit = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if already credited today
    if (user.dailyLoginCredited) {
      return res.json({
        message: "Daily login credit already awarded today",
        credited: false,
      });
    }

    // Award credits
    const creditAmount = 5;
    user.credits += creditAmount;
    user.dailyLoginCredited = true;
    await user.save();

    // Record transaction
    await CreditTransaction.create({
      user: user._id,
      amount: creditAmount,
      balance: user.credits,
      type: "daily_login",
      reason: "Daily login reward",
    });

    // Record activity
    await Activity.create({
      user: user._id,
      type: "credit_earned",
      data: {
        amount: creditAmount,
        reason: "Daily login",
        newBalance: user.credits,
      },
    });

    res.json({
      message: "Daily login credit awarded",
      amount: creditAmount,
      credits: user.credits,
      credited: true,
    });
  } catch (error) {
    console.error("Daily login credit error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get credit history
// @route   GET /api/credits/history
// @access  Private
exports.getCreditHistory = async (req, res) => {
  try {
    const transactions = await CreditTransaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(transactions);
  } catch (error) {
    console.error("Get credit history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
