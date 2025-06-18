const express = require("express");
const router = express.Router();
const { requestConnection } = require("../controllers/connectionController");
const Connection = require("../models/Connection");
const User = require("../models/User");

router.post("/request", requestConnection);

router.post("/check-expirations", async (req, res) => {
  try {
    const now = new Date();
    
    // Find expired connections
    const expiredConnections = await Connection.find({
      status: "active",
      expiresAt: { $lt: now }
    });

    if (expiredConnections.length === 0) {
      return res.json({ message: "No expired connections" });
    }

    // Update connection statuses
    await Connection.updateMany(
      { _id: { $in: expiredConnections.map(c => c._id) } },
      { $set: { status: "expired" } }
    );

    // Reset user eligibility
    const userIds = expiredConnections.reduce((ids, conn) => {
      ids.push(conn.user1, conn.user2);
      return ids;
    }, []);

    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { isEligibleForConnection: true } }
    );

    res.json({ 
      message: "Expired connections processed", 
      count: expiredConnections.length 
    });
  } catch (err) {
    console.error("Connection expiration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
