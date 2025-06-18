// backend/routes/connectionRoutes.js
const express = require("express");
const router = express.Router();
const { requestConnection } = require("../controllers/connectionController");

router.post("/request", requestConnection);

module.exports = router;
