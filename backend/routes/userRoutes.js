const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");
const User = require("../models/User");

// Register new user
router.post("/register", registerUser);

// ✅ Add GET route to fetch user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
