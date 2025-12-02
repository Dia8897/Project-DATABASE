import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isUser, isUserOrAdmin } from "../middleware/auth.js";


const router = Router();

// GET 
router.get("/", verifyToken, isUserOrAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM TRAINING");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch training", err);
    res.status(500).json({ message: "Failed to fetch trainings" });
  }
});


router.get("/:id", verifyToken,  isUserOrAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM TRAINING WHERE trainingId = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ message: "Training not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch training", err);
    res.status(500).json({ message: "Failed to fetch traning" });
  }
});


router.post("/", verifyToken, isAdmin, async (req, res) => {
  const { title, type, description, startTime, endTime, location, date} = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO TRAINING (title, type, description, startTime, endTime, location, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, type, description, startTime, endTime, location, date]
    );
    res.status(201).json({ trainingId: result.insertId, message: "Training created" });
  } catch (err) {
    console.error("Failed to create training", err);
    res.status(500).json({ message: "Failed to create training" });
  }
});


router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { title, type, description, startTime, endTime, location, date } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE TRAINING 
       SET title=?, type=?, description=?, startTime=?, endTime=?, location=?, date=? 
       WHERE trainingId=?`,
      [title, type, description, startTime, endTime, location, date, id]   // ✅ use id here
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Training not found" });
    }

    res.json({ message: "Training updated" });
  } catch (err) {
    console.error("Failed to update training", err);
    res.status(500).json({ message: "Failed to update training" });
  }
});



router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM TRAINING WHERE trainingId = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Training not found" });
    }
    res.json({ message: "Training deleted" });
  } catch (err) {
    console.error("Failed to delete training", err);
    res.status(500).json({ message: "Failed to delete training" });
  }
});

export default router;
