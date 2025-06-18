// backend/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reflections", require("./routes/reflectionRoutes"));

app.get("/", (req, res) => {
  res.send("Amor Fly Backend API is running");
});

module.exports = app;
