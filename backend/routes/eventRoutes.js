import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isUser, isClient } from "../middleware/auth.js";


const router = Router();

// GET - Only approved events
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM EVENTS WHERE status = 'accepted'");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch events", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// GET /api/events/:id - Fetch a single approved event
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM EVENTS WHERE eventId = ? AND status = 'accepted'", [id]);
    if (!rows.length) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch event", err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

// POST - Client submits event request
router.post("/", verifyToken, isClient, async (req, res) => {
  const { title, type, description, location, startsAt, endsAt, venue,
 nbOfHosts, floorPlan, attendeesList, rate,
 teamLeaderId, clothesId } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO EVENTS (title, type, description, location, startsAt, endsAt, venue,
 nbOfHosts, floorPlan, attendeesList, rate,
 teamLeaderId, clothesId, clientId, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
`,
      [title, type, description, location, startsAt, endsAt, venue,
 nbOfHosts, floorPlan, attendeesList, rate,
 teamLeaderId, clothesId, req.user.id]
    );
    res.status(201).json({ eventId: result.insertId, message: "Event request submitted" });
  } catch (err) {
    console.error("Failed to create event request", err);
    res.status(500).json({ message: "Failed to create event request" });
  }
});


router.put("/:id", verifyToken, isAdmin,async (req, res) => {
  const { id } = req.params;
  const { title, type, description, location, startsAt, endsAt, venue,
 nbOfHosts, floorPlan, attendeesList, rate,
 teamLeaderId, clothesId, clientId, adminId } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE EVENTS SET title=?, type=?, description=?, location=?, startsAt=?, endsAt=?, venue=?,
 nbOfHosts=?, floorPlan=?, attendeesList=?, rate=?,
 teamLeaderId=?, clothesId=?, clientId=?, adminId=?`,
      [title, type, description, location, startsAt, endsAt, venue,
 nbOfHosts, floorPlan, attendeesList, rate,
 teamLeaderId, clothesId, clientId, adminId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event updated" });
  } catch (err) {
    console.error("Failed to update event", err);
    res.status(500).json({ message: "Failed to update event" });
  }
});


router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM EVENTS WHERE eventId = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Failed to delete event", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

export default router;
