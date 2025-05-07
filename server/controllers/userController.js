const User = require("../models/User");
const Activity = require("../models/Activity");
const CreditTransaction = require("../models/CreditTransaction");

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = {
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      socialLinks: user.socialLinks,
      profileCompleted: user.profileCompleted,
      credits: user.credits,
    };

    res.json(profile);
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, location, socialLinks } = req.body;

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if profile is being completed for the first time
    const isFirstCompletion = !user.profileCompleted && bio && location;

    // Update fields
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.location = location || user.location;

    if (socialLinks) {
      user.socialLinks = {
        ...user.socialLinks,
        ...socialLinks,
      };
    }

    // Check if profile is now complete
    if (isFirstCompletion) {
      user.profileCompleted = true;

      // Record profile completion activity
      await Activity.create({
        user: user._id,
        type: "profile_update",
        data: {
          action: "profile_completed",
        },
      });
    }

    await user.save();

    res.json({
      name: user.name,
      bio: user.bio,
      location: user.location,
      socialLinks: user.socialLinks,
      profileCompleted: user.profileCompleted,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
