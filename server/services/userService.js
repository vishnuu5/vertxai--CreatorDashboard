const User = require("../models/User");
const { ApiError } = require("../utils/errorHandler");
const activityService = require("./activityService");
const creditService = require("./creditService");


const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};


const updateUserProfile = async (userId, profileData) => {
  const { name, bio, location, socialLinks } = profileData;

  // Find user
  const user = await getUserById(userId);

  // Check if profile is being completed for the first time
  const isFirstCompletion = !user.profileCompleted && bio && location;

  // Update fields
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;

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
    await activityService.createActivity(userId, "profile_update", {
      action: "profile_completed",
    });

    // Award credits for profile completion
    await creditService.addCredits(
      userId,
      10,
      "Profile completion",
      "profile_completion"
    );
  }

  await user.save();

  return {
    name: user.name,
    email: user.email,
    bio: user.bio,
    location: user.location,
    socialLinks: user.socialLinks,
    profileCompleted: user.profileCompleted,
    credits: user.credits,
  };
};


const changePassword = async (userId, currentPassword, newPassword) => {
  // Find user
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return true;
};


const deleteAccount = async (userId) => {
  const result = await User.findByIdAndDelete(userId);

  if (!result) {
    throw new ApiError(404, "User not found");
  }

  return true;
};

module.exports = {
  getUserById,
  updateUserProfile,
  changePassword,
  deleteAccount,
};
