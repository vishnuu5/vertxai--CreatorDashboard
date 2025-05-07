const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");
const { ApiError } = require("../utils/errorHandler");
const activityService = require("./activityService");

/**
 * Add credits to user
 * @param {string} userId - User ID
 * @param {number} amount - Amount of credits to add
 * @param {string} reason - Reason for adding credits
 * @param {string} type - Transaction type
 * @returns {Object} Updated credit information
 */
const addCredits = async (userId, amount, reason, type = "interaction") => {
  if (!amount || amount <= 0) {
    throw new ApiError(400, "Invalid credit amount");
  }

  // Update user's credits
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.credits += amount;
  await user.save();

  // Record transaction
  const transaction = await CreditTransaction.create({
    user: user._id,
    amount,
    balance: user.credits,
    type,
    reason: reason || "Credit adjustment",
  });

  // Record activity
  await activityService.createActivity(userId, "credit_earned", {
    amount,
    reason,
    newBalance: user.credits,
  });

  return {
    transaction,
    newBalance: user.credits,
  };
};

/**
 * Get credit history for user
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of transactions to return
 * @returns {Array} Credit transactions
 */
const getCreditHistory = async (userId, limit = 30) => {
  const transactions = await CreditTransaction.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  return transactions;
};

/**
 * Award daily login credit
 * @param {string} userId - User ID
 * @returns {Object} Credit award result
 */
const awardDailyLoginCredit = async (userId) => {
  // Find user
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if already credited today
  if (user.dailyLoginCredited) {
    return {
      message: "Daily login credit already awarded today",
      credited: false,
      credits: user.credits,
    };
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
  await activityService.createActivity(userId, "credit_earned", {
    amount: creditAmount,
    reason: "Daily login",
    newBalance: user.credits,
  });

  return {
    message: "Daily login credit awarded",
    amount: creditAmount,
    credits: user.credits,
    credited: true,
  };
};

module.exports = {
  addCredits,
  getCreditHistory,
  awardDailyLoginCredit,
};
