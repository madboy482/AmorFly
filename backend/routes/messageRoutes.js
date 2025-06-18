const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// GET all messages for a pod
router.get("/:podId", async (req, res) => {
  try {
    const podId = req.params.podId;
    
    const messages = await Message.find({ podId })
      .sort({ createdAt: 1 })
      .limit(100);
      
    res.json({ messages });
  } catch (err) {
    console.error("Message GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
