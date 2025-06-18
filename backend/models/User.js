const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  skill: { type: String, required: true },
  personalityType: { type: String, required: true },
  progressPoints: { type: Number, default: 0 },
  podId: { type: mongoose.Schema.Types.ObjectId, ref: "Pod", default: null },
  lastConnectionDate: { type: Date, default: null },
  isEligibleForConnection: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
