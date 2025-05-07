const mongoose = require("mongoose");

const SavedPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate saves
SavedPostSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model("SavedPost", SavedPostSchema);
