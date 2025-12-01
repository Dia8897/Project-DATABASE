import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// GET 
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM EVENTS");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch events", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// GET /api/users/:id - Fetch a single user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM EVENTS WHERE eventId = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch event", err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

// POST 
router.post("/", async (req, res) => {
  const { title, type, description, location, startsAt, endsAt, venue,
 nbOfHosts, floorPlan, attendeesList, rate,
 teamLeaderId, clothesId, clientId, adminId } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO EVENTS (title, type, description, location, startsAt, endsAt, venue,
 nbOfHosts, floorPlan, attendeesList, rate,
 teamLeaderId, clothesId, clientId, adminId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, type, description, location, startsAt, endsAt, venue,
 nbOfHosts, floorPlan, attendeesList, rate,
 teamLeaderId, clothesId, clientId, adminId]
    );
    res.status(201).json({ clientId: result.insertId, message: "Event created" });
  } catch (err) {
    console.error("Failed to create event", err);
    res.status(500).json({ message: "Failed to create event" });
  }
});


router.put("/:id", async (req, res) => {
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


router.delete("/:id", async (req, res) => {
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
