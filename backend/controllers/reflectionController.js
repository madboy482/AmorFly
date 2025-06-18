const Reflection = require("../models/Reflection");
const User = require("../models/User");

// POST /api/reflections
exports.createReflection = async (req, res) => {
  try {
    const { userId, podId, content } = req.body;
    if (!userId || !podId || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const reflection = new Reflection({ userId, podId, content });
    await reflection.save();

    // Award progress points for reflection
    await User.findByIdAndUpdate(userId, {
      $inc: { progressPoints: 5 },
      $set: { isEligibleForConnection: true }
    });

    res.status(201).json({ message: "Reflection saved", reflection });
  } catch (err) {
    console.error("Reflection POST error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/reflections/:podId
exports.getReflectionsByPod = async (req, res) => {
  try {
    const podId = req.params.podId;

    const reflections = await Reflection.find({ podId })
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    res.json({ reflections });
  } catch (err) {
    console.error("Reflection GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
