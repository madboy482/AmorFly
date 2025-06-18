const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  podId: { type: mongoose.Schema.Types.ObjectId, ref: "Pod", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  type: { type: String, enum: ["text", "link", "image"], default: "text" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
