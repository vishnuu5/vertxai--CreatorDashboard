const Activity = require("../models/Activity");

/**
 * Create a new activity record
 * @param {string} userId - User ID
 * @param {string} type - Activity type
 * @param {Object} data - Additional activity data
 * @returns {Object} Created activity
 */
const createActivity = async (userId, type, data = {}) => {
  const activity = await Activity.create({
    user: userId,
    type,
    data,
  });

  return activity;
};

/**
 * Get recent activity for user
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of activities to return
 * @returns {Array} Recent activities
 */
const getRecentActivity = async (userId, limit = 10) => {
  const activities = await Activity.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  // Format activities for frontend
  const formattedActivities = activities.map((activity) => {
    let description = "";

    switch (activity.type) {
      case "login":
        description = "You logged in";
        break;
      case "post_save":
        description = `You saved a post: ${activity.data?.title || "Untitled"}`;
        break;
      case "post_share":
        description = "You shared a post";
        break;
      case "post_report":
        description = "You reported a post";
        break;
      case "credit_earned":
        description = `You earned ${activity.data?.amount || 0} credits: ${
          activity.data?.reason || ""
        }`;
        break;
      case "profile_update":
        description = "You updated your profile";
        break;
      default:
        description = "Activity recorded";
    }

    return {
      id: activity._id,
      type: activity.type,
      description,
      createdAt: activity.createdAt,
    };
  });

  return formattedActivities;
};

module.exports = {
  createActivity,
  getRecentActivity,
};
