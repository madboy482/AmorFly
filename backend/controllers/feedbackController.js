// backend/controllers/feedbackController.js
const Feedback = require("../models/Feedback");
const User = require("../models/User");

exports.submitFeedback = async (req, res) => {
  try {
    const { from, to, podId, rating, comment } = req.body;

    if (!from || !to || !podId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const feedback = new Feedback({ from, to, podId, rating, comment });
    await feedback.save();

    // Update progressPoints based on rating
    const increment = Math.min(10, rating * 2); // e.g. 5 stars = +10 pts max
    await User.findByIdAndUpdate(to, { $inc: { progressPoints: increment } });

    return res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};