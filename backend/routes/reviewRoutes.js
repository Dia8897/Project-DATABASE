import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isUser } from "../middleware/auth.js";

const router = Router();
const MIN_STAR_RATING = 1;
const MAX_STAR_RATING = 5;

const parsePositiveInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const parseStarRating = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) return null;
  if (parsed < MIN_STAR_RATING || parsed > MAX_STAR_RATING) return null;
  return parsed;
};

const coerceVisibility = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "visible", "public"].includes(normalized)) return true;
    if (["0", "false", "hidden", "private"].includes(normalized)) return false;
  }
  return null;
};

router.get("/", verifyToken, async (req, res) => {
  const isAdminRequest = req.user.role === "admin";
  const sql = isAdminRequest
    ? "SELECT * FROM REVIEW"
    : "SELECT * FROM REVIEW WHERE visibility = 1";
  try {
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch reviews", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});


router.get("/:reviewerId/:eventId", verifyToken, isAdmin, async (req, res) => {
  const { reviewerId, eventId } = req.params;
  const parsedReviewerId = parsePositiveInt(reviewerId);
  const parsedEventId = parsePositiveInt(eventId);

  if (!parsedReviewerId || !parsedEventId) {
    return res.status(400).json({ message: "Invalid reviewer or event id" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM REVIEW WHERE reviewerId = ? AND eventId = ?",
      [parsedReviewerId, parsedEventId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch review", err);
    res.status(500).json({ message: "Failed to fetch review" });
  }
});

router.post("/", verifyToken, isUser, async (req, res) => {
  const body = req.body ?? {};
  const { eventId, starRating, content, visibility } = body;
  const parsedEventId = parsePositiveInt(eventId);
  const parsedRating = parseStarRating(starRating);
  const trimmedContent = typeof content === "string" ? content.trim() : "";
  const normalizedVisibility = coerceVisibility(
    typeof visibility === "undefined" ? true : visibility
  );

  if (!parsedEventId) {
    return res.status(400).json({ message: "Invalid event id" });
  }
  if (parsedRating === null) {
    return res.status(400).json({ message: "starRating must be an integer between 1 and 5" });
  }
  if (!trimmedContent) {
    return res.status(400).json({ message: "content is required" });
  }
  if (normalizedVisibility === null) {
    return res.status(400).json({ message: "visibility must be boolean-like" });
  }

  try {
    const [leaderCheck] = await db.query(
      `SELECT 1 FROM EVENTS WHERE eventId = ? AND teamLeaderId = ?`,
      [parsedEventId, req.user.id]
    );
    if (!leaderCheck.length) {
      return res
        .status(403)
        .json({ message: "Only the assigned team leader can review this event" });
    }

    const [existingReview] = await db.query(
      "SELECT 1 FROM REVIEW WHERE reviewerId = ? AND eventId = ?",
      [req.user.id, parsedEventId]
    );
    if (existingReview.length) {
      return res.status(409).json({ message: "You have already reviewed this event" });
    }

    await db.query(
      `INSERT INTO REVIEW (reviewerId, eventId, starRating, content, visibility)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, parsedEventId, parsedRating, trimmedContent, Number(normalizedVisibility)]
    );

    res.status(201).json({
      message: "Review created",
      review: {
        reviewerId: req.user.id,
        eventId: parsedEventId,
        starRating: parsedRating,
        content: trimmedContent,
        visibility: normalizedVisibility
      }
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "A review already exists for this event" });
    }
    console.error("Failed to create review", err);
    res.status(500).json({ message: "Failed to create review" });
  }
});

router.patch("/:reviewerId/:eventId/visibility", verifyToken, isAdmin, async (req, res) => {
  const { reviewerId, eventId } = req.params;
  const parsedReviewerId = parsePositiveInt(reviewerId);
  const parsedEventId = parsePositiveInt(eventId);
  const visibilityInput = req.body?.visibility;

  if (!parsedReviewerId || !parsedEventId) {
    return res.status(400).json({ message: "Invalid reviewer or event id" });
  }
  if (typeof visibilityInput === "undefined") {
    return res.status(400).json({ message: "visibility is required" });
  }
  const normalizedVisibility = coerceVisibility(visibilityInput);
  if (normalizedVisibility === null) {
    return res.status(400).json({ message: "visibility must be boolean-like" });
  }

  try {
    const [result] = await db.query(
      `UPDATE REVIEW SET visibility = ? WHERE reviewerId = ? AND eventId = ?`,
      [Number(normalizedVisibility), parsedReviewerId, parsedEventId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({
      message: normalizedVisibility ? "Review made visible" : "Review hidden from public view",
      visibility: normalizedVisibility
    });
  } catch (err) {
    console.error("Failed to update visibility", err);
    res.status(500).json({ message: "Failed to update review visibility" });
  }
});

router.put("/:reviewerId/:eventId", verifyToken, isUser, async (req, res) => {
  const { reviewerId, eventId } = req.params;
  const parsedReviewerId = parsePositiveInt(reviewerId);
  const parsedEventId = parsePositiveInt(eventId);

  if (!parsedReviewerId || !parsedEventId) {
    return res.status(400).json({ message: "Invalid reviewer or event id" });
  }
  if (req.user.id !== parsedReviewerId) {
    return res.status(403).json({ message: "Access denied" });
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const { starRating, content, visibility } = req.body;
  const parsedRating = typeof starRating !== "undefined" ? parseStarRating(starRating) : undefined;
  const trimmedContent =
    typeof content !== "undefined" ? (typeof content === "string" ? content.trim() : "") : undefined;
  const normalizedVisibility =
    typeof visibility !== "undefined" ? coerceVisibility(visibility) : undefined;

  if (typeof starRating !== "undefined" && parsedRating === null) {
    return res.status(400).json({ message: "starRating must be an integer between 1 and 5" });
  }
  if (typeof content !== "undefined" && !trimmedContent) {
    return res.status(400).json({ message: "content cannot be empty" });
  }
  if (typeof visibility !== "undefined" && normalizedVisibility === null) {
    return res.status(400).json({ message: "visibility must be boolean-like" });
  }

  const fields = [];
  const values = [];

  if (typeof parsedRating !== "undefined") {
    fields.push("starRating = ?");
    values.push(parsedRating);
  }
  if (typeof trimmedContent !== "undefined") {
    fields.push("content = ?");
    values.push(trimmedContent);
  }
  if (typeof normalizedVisibility !== "undefined") {
    fields.push("visibility = ?");
    values.push(Number(normalizedVisibility));
  }

  if (!fields.length) {
    return res
      .status(400)
      .json({ message: "Provide at least one of starRating, content, or visibility to update" });
  }

  values.push(parsedReviewerId, parsedEventId);

  try {
    const [result] = await db.query(
      `UPDATE REVIEW SET ${fields.join(", ")} WHERE reviewerId = ? AND eventId = ?`,
      values
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

router.delete("/:reviewerId/:eventId", verifyToken, isUser, async (req, res) => {
  const { reviewerId, eventId } = req.params;
  const parsedReviewerId = parsePositiveInt(reviewerId);
  const parsedEventId = parsePositiveInt(eventId);

  if (!parsedReviewerId || !parsedEventId) {
    return res.status(400).json({ message: "Invalid reviewer or event id" });
  }
  if (req.user.id !== parsedReviewerId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM REVIEW WHERE reviewerId = ? AND eventId = ?",
      [parsedReviewerId, parsedEventId]
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
