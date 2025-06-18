const express = require("express");
const router = express.Router();
const {
  createReflection,
  getReflectionsByPod,
} = require("../controllers/reflectionController");

// POST a new reflection
router.post("/", createReflection);

// GET all reflections for a pod
router.get("/:podId", getReflectionsByPod);

module.exports = router;
