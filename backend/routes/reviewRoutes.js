import { Router } from "express";
import db from "../config/db.js";

const router = Router();

/* ============================================
   GET ALL REVIEWS
   GET /api/reviews
=============================================== */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM REVIEW");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch reviews", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

/* ============================================
   GET ONE REVIEW (BY COMPOSITE KEY)
   GET /api/reviews/:reviewerId/:eventId
=============================================== */
router.get("/:reviewerId/:eventId", async (req, res) => {
  const { reviewerId, eventId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM REVIEW WHERE reviewerId = ? AND eventId = ?",
      [reviewerId, eventId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch review", err);
    res.status(500).json({ message: "Failed to fetch review" });
  }
});

/* ============================================
   CREATE NEW REVIEW
   POST /api/reviews
=============================================== */
router.post("/", async (req, res) => {
  const { reviewerId, eventId, starRating, content, visibility } = req.body;

  try {
    await db.query(
      `INSERT INTO REVIEW (reviewerId, eventId, starRating, content, visibility)
       VALUES (?, ?, ?, ?, ?)`,
      [reviewerId, eventId, starRating, content, visibility]
    );

    res.status(201).json({
      message: "Review created",
      review: { reviewerId, eventId, starRating, content, visibility }
    });
  } catch (err) {
    console.error("Failed to create review", err);
    res.status(500).json({ message: "Failed to create review" });
  }
});

/* ============================================
   UPDATE REVIEW
   PUT /api/reviews/:reviewerId/:eventId
=============================================== */
router.put("/:reviewerId/:eventId", async (req, res) => {
  const { reviewerId, eventId } = req.params;
  const { starRating, content, visibility } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE REVIEW
       SET starRating = ?, content = ?, visibility = ?
       WHERE reviewerId = ? AND eventId = ?`,
      [starRating, content, visibility, reviewerId, eventId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review updated" });
  } catch (err) {
    console.error("Failed to update review", err);
    res.status(500).json({ message: "Failed to update review" });
  }
});

/* ============================================
   DELETE REVIEW
   DELETE /api/reviews/:reviewerId/:eventId
=============================================== */
router.delete("/:reviewerId/:eventId", async (req, res) => {
  const { reviewerId, eventId } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM REVIEW WHERE reviewerId = ? AND eventId = ?",
      [reviewerId, eventId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("Failed to delete review", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

export default router;
