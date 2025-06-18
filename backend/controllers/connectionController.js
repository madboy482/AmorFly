const User = require("../models/User");
const Connection = require("../models/Connection");

exports.requestConnection = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });    if (user.progressPoints < 20) {
      return res.status(403).json({ error: "Not enough progress points (20 required)" });
    }
    
    if (!user.isEligibleForConnection) {
      return res.status(403).json({ error: "You are not eligible for a connection at this time" });
    }

    const now = new Date();

    // Check user's own cooldown
    if (user.lastConnectionDate && now - user.lastConnectionDate < 7 * 24 * 60 * 60 * 1000) {
      return res.status(403).json({ error: "You can only connect once per week" });
    }

    // 🔍 Search for compatible user in same pod & skill
    const candidates = await User.find({
      _id: { $ne: userId },
      podId: user.podId,
      skill: user.skill,
      progressPoints: { $gte: 20 },
      isEligibleForConnection: true,
      $or: [
        { lastConnectionDate: null },
        { lastConnectionDate: { $lt: new Date(now - 7 * 24 * 60 * 60 * 1000) } }
      ]
    });

    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ error: "No compatible user found at the moment" });
    }

    const compatibleUser = candidates[0]; // pick first eligible one
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 🧩 Create connection
    const connection = new Connection({
      user1: userId,
      user2: compatibleUser._id,
      skill: user.skill,
      status: "active",
      startedAt: now,
      expiresAt,
    });

    await connection.save();

    // 🧠 Update both users
    await User.findByIdAndUpdate(userId, {
      lastConnectionDate: now,
      isEligibleForConnection: false,
    });

    await User.findByIdAndUpdate(compatibleUser._id, {
      lastConnectionDate: now,
      isEligibleForConnection: false,
    });

    return res.status(201).json({ message: "Connection created", connection });
  } catch (error) {
    console.error("Connection Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
