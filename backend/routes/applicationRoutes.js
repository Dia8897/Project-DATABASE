import express from "express";

const router = express.Router();

// GET all applications
router.get("/", (req, res) => {
  res.json({ message: "Get all applications - coming soon" });
});

// POST new application
router.post("/", (req, res) => {
  res.json({ message: "Create application - coming soon" });
});

export default router;