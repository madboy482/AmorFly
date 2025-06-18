const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");
const User = require("../models/User");

// Register new user
router.post("/register", registerUser);

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

router.patch("/:id/eligibility", async (req, res) => {
  try {
    const { isEligible } = req.body;
    if (isEligible === undefined) {
      return res.status(400).json({ error: "isEligible field is required" });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isEligibleForConnection: isEligible },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ user });
  } catch (err) {
    console.error("Error updating eligibility:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
