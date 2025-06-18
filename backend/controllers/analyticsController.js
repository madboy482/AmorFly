const User = require("../models/User");
const Message = require("../models/Message");
const Feedback = require("../models/Feedback");
const Reflection = require("../models/Reflection");

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalReflections = await Reflection.countDocuments();

    const topSkills = await User.aggregate([
      { $group: { _id: "$skill", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topUsers = await User.find()
      .sort({ progressPoints: -1 })
      .limit(5)
      .select("username progressPoints");

    const feedbackStats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalFeedbacks: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalMessages,
      totalReflections,
      topSkills,
      topUsers,
      avgRating: feedbackStats[0]?.avgRating || 0,
      totalFeedbacks: feedbackStats[0]?.totalFeedbacks || 0
    });
  } catch (error) {
    console.error("Analytics error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
