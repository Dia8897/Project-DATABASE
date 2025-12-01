import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isUser } from "../middleware/auth.js";


const router = Router();

// GET /api/users - Fetch all event application
router.get("/", verifyToken,  async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM EVENT_APP");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch event app", err);
    res.status(500).json({ message: "Failed to fetch event app" });
  }
});

// GET Fetch a single EVENT_APP by ID
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM EVENT_APP WHERE eventAppId = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ message: "Event app not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch event application", err);
    res.status(500).json({ message: "Failed to fetch event application" });
  }
});

// POST Create a new EVENT_APP
// POST Create a new EVENT_APP
router.post("/", verifyToken, isUser, async (req, res) => {
  try {
    // Only take these fields from request body - user can't set status, senderId, etc.
    const { requestedRole, notes, eventId } = req.body;
   

    const [result] = await db.query(
      `INSERT INTO EVENT_APP (status, requestedRole, assignedRole, notes, sentAt, decidedAt, senderId, adminId, eventId)
       VALUES (?, ?, ?, ?, NOW(), NULL, ?, NULL, ?)`,
      ['pending', requestedRole, null, notes, req.user.id, eventId]
    );

    res.status(201).json({
      eventAppId: result.insertId,
      message: "Event application created"
    });

  } catch (err) {
    console.error("Failed to create event application", err);
    res.status(500).json({ message: "Failed to create event application" });
  }
});



router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, requestedRole, assignedRole, notes, sentAt, decidedAt, senderId, adminId, eventId } = req.body;
try{
  const [result] = await db.query(
  `UPDATE EVENT_APP
   SET status = ?, requestedRole = ?, assignedRole = ?, notes = ?, sentAt = ?, decidedAt = ?, senderId = ?, adminId = ?, eventId = ?
   WHERE eventAppId = ?`,
  [status, requestedRole, assignedRole, notes, sentAt, decidedAt, senderId, adminId, eventId, id]
);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event application not found" });
    }
    res.json({ message: "Event application updated" });
  } catch (err) {
    console.error("Failed to update event application", err);
    res.status(500).json({ message: "Failed to update event application" });
  }
});


router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
   const [result] = await db.query("DELETE FROM EVENT_APP WHERE eventAppId = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event application not found" });
    }
    res.json({ message: "Event application deleted" });
  } catch (err) {
    console.error("Failed to delete event application", err);
    res.status(500).json({ message: "Failed to delete event application" });
  }
});

export default router;
