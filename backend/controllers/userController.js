// backend/controllers/userController.js
const User = require("../models/User");
const Pod = require("../models/Pod");
const generateUsername = require("../utils/generateUsername");

exports.registerUser = async (req, res) => {
  try {
    const { skill, personalityType } = req.body;
    if (!skill || !personalityType) {
      return res.status(400).json({ error: "Skill and personality type required" });
    }

    const username = await generateUsername();

    const user = new User({
      username,
      skill,
      personalityType,
      isEligibleForConnection: true,
    });

    // Pod Matching Logic
    let pod = await Pod.findOne({
      skill,
      $expr: { $lt: [{ $size: "$members" }, 6] }
    });

    if (!pod) {
      pod = new Pod({ skill, members: [] });
      await pod.save();
    }

    user.podId = pod._id;
    pod.members.push(user._id);

    await user.save();
    await pod.save();

    return res.status(201).json({ user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
