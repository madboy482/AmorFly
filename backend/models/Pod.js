const mongoose = require("mongoose");

const podSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pod", podSchema);
