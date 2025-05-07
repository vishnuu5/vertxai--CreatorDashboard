const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
    enum: ["spam", "inappropriate", "offensive", "misinformation", "other"],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "dismissed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", ReportSchema);
