const Activity = require("../models/Activity");

// @route   GET /api/activity/recent
exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Format activities for frontend
    const formattedActivities = activities.map((activity) => {
      let description = "";

      switch (activity.type) {
        case "login":
          description = "You logged in";
          break;
        case "post_save":
          description = `You saved a post: ${
            activity.data?.title || "Untitled"
          }`;
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

    res.json(formattedActivities);
  } catch (error) {
    console.error("Get recent activity error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
