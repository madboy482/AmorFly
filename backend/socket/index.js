// backend/socket/index.js
const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinPod", ({ podId, userId }) => {
      socket.join(podId);
      console.log(`🛬 User ${userId} joined pod ${podId}`);
    });

    socket.on("sendMessage", async ({ podId, senderId, content, type = "text" }) => {
      console.log("📥 Received message:", { podId, senderId, content });

      if (!content || !podId || !senderId) {
        console.log("⚠️ Missing data in message. Message not saved.");
        return;
      }

      try {
        const message = new Message({
          podId,
          sender: senderId,
          content,
          type,
        });

        await message.save();

        io.to(podId).emit("receiveMessage", {
          _id: message._id,
          podId,
          sender: senderId,
          content,
          type,
          createdAt: message.createdAt,
        });

        console.log("✅ Message saved and broadcasted.");
      } catch (err) {
        console.error("❌ Error saving message:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
