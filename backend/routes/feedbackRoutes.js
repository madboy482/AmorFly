const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const User = require("../models/User");

// ✅ POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const { from, to, podId, rating, comment } = req.body;

    if (!from || !to || !rating || !podId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const feedback = new Feedback({
      from,
      to,
      podId,
      rating,
      comment,
      createdAt: new Date()
    });

    await feedback.save();

    // 🎁 Bonus: Add progress points to sender
    await User.findByIdAndUpdate(from, {
      $inc: { progressPoints: 5 }
    });

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    console.error("❌ Feedback error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
