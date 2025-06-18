const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  skill: { type: String },
  status: { type: String, enum: ["pending", "active", "expired"], default: "pending" },
  startedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

module.exports = mongoose.model("Connection", connectionSchema);
