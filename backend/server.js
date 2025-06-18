// backend/server.js
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// ✅ FIX: Proper CORS for frontend at localhost:3000
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // allow frontend to connect
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize socket events
require("./socket")(io);

console.log("✅ Socket.io initialized.");

// DB + server start
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
