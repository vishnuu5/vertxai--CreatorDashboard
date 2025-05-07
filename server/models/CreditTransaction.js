const mongoose = require("mongoose");

const CreditTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "daily_login",
      "profile_completion",
      "interaction",
      "admin_adjustment",
      "other",
    ],
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CreditTransaction", CreditTransactionSchema);
