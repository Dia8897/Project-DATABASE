import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isClient ,isUserOrAdmin} from "../middleware/auth.js";

const router = Router();


//GET all approved events 
router.get("/", isUserOrAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM EVENTS WHERE status = 'approved'"
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch events", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});


/* ---------------------- SINGLE APPROVED EVENT ---------------------- */

// PUBLIC: GET single approved event 
router.get("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM EVENTS WHERE eventId = ? AND status = 'approved'",
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch event", err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

/* ---------------------- CLIENT: CREATE EVENT REQUEST ---------------------- */

// CLIENT: create an event request (status = 'pending')
router.post("/", verifyToken, isClient, async (req, res) => {
  const {
    type,
    description,
    location,
    startsAt,
    endsAt,
    nbOfHosts
  } = req.body;

  // Auto-generated title
  const eventDate = startsAt ? startsAt.split("T")[0] : "Event";
  const title = `${type} on ${eventDate}`;

  // Internal controlled fields
  const clientId = req.user.id;  // take client ID from token
  const venue = null;
  const floorPlan = null;
  const attendeesList = null;
  const rate = null;
  const teamLeaderId = null;
  const clothesId = null;
  const adminId = null;
  const status = "pending";      // always pending on creation

  try {
    const [result] = await db.query(
      `INSERT INTO EVENTS (
         title, type, description, location, startsAt, endsAt, venue,
         nbOfHosts, floorPlan, attendeesList, rate,
         teamLeaderId, clothesId, clientId, adminId, status
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        type,
        description,
        location,
        startsAt,
        endsAt,
        venue,
        nbOfHosts,
        floorPlan,
        attendeesList,
        rate,
        teamLeaderId,
        clothesId,
        clientId,
        adminId,
        status
      ]
    );

    res.status(201).json({
      eventId: result.insertId,
      message: "Event request submitted (pending approval)"
    });



  } catch (err) {
    console.error("Failed to create event", err);
    res.status(500).json({ message: "Failed to create event" });
  }
});


/* ---------------------- ADMIN: FULL UPDATE & DELETE ---------------------- */

// ADMIN: update full event (fields + status if needed)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    type,
    description,
    location,
    startsAt,
    endsAt,
    venue,
    nbOfHosts,
    floorPlan,
    attendeesList,
    rate,
    teamLeaderId,
    clothesId,
    clientId,
    adminId,
    status
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE EVENTS SET
         title = ?, type = ?, description = ?, location = ?, startsAt = ?, endsAt = ?, venue = ?,
         nbOfHosts = ?, floorPlan = ?, attendeesList = ?, rate = ?,
         teamLeaderId = ?, clothesId = ?, clientId = ?, adminId = ?, status = ?
       WHERE eventId = ?`,
      [
        title,
        type,
        description,
        location,
        startsAt,
        endsAt,
        venue,
        nbOfHosts,
        floorPlan,
        attendeesList,
        rate,
        teamLeaderId,
        clothesId,
        clientId,
        adminId,
        status,
        id
      ]
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

// ADMIN: delete event
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "DELETE FROM EVENTS WHERE eventId = ?",
      [id]
    );
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
