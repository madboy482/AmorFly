// backend/models/Reflection.js
const mongoose = require("mongoose");

const reflectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  podId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reflection", reflectionSchema);
