import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isClient } from "../middleware/auth.js";

const router = Router();
const ALLOWED_STATUSES = ["pending", "accepted", "rejected"];
const HAS_TIME = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2})?/;

// List all accepted events (public)
router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM EVENTS WHERE status = 'accepted'");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch events", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Get a single accepted event (public)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM EVENTS WHERE eventId = ? AND status = 'accepted'",
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Event not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch event", err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

// Client creates an event request (pending)
router.post("/", verifyToken, isClient, async (req, res) => {
  const { type, description, location, startsAt, endsAt, nbOfHosts } = req.body;

  // Quick validation
  if (!type || !description || !location || !startsAt || !endsAt || !nbOfHosts) {
    return res.status(400).json({ message: "type, description, location, startsAt, endsAt, and nbOfHosts are required" });
  }
  if (!HAS_TIME.test(String(startsAt)) || !HAS_TIME.test(String(endsAt))) {
    return res.status(400).json({ message: "startsAt and endsAt must include a time (e.g., 2026-06-15 00:00:00)" });
  }

  const now = new Date();
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid dates" });
  }

  if (start < now || end < now) {
    return res.status(400).json({ message: "Dates must be in the future" });
  }

  if (start >= end) {
    return res.status(400).json({ message: "endsAt must be after startsAt" });
  }
  //if the client sent a title, trim whitespaces and use it, otherwise autogenerate one
  const title = req.body.title?.trim() || `${type} on ${String(startsAt).split("T")[0]}`;
  const clientId = req.user.id;

  try {
    const [result] = await db.query(
      `INSERT INTO EVENTS (
         title, type, description, location, startsAt, endsAt, venue,
         nbOfHosts, floorPlan, attendeesList, rate,
         teamLeaderId, clothesId, clientId, adminId, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      , [
        title,
        type,
        description,
        location,
        startsAt,
        endsAt,
        req.body.venue ?? null,
        Number(nbOfHosts),
        req.body.floorPlan ?? null,
        req.body.attendeesList ?? null,
        req.body.rate ?? null,
        req.body.teamLeaderId ?? null,
        req.body.clothesId ?? null,
        clientId,
        null,
        "pending"
      ]
    );

    res.status(201).json({ eventId: result.insertId, message: "Event request submitted (pending approval)" });
  } catch (err) {
    console.error("Failed to create event", err);
    res.status(500).json({ message: "Failed to create event" });
  }
});

// Admin updates an event (fields and/or status)
//Admin updates go through PUT /api/events/:id with a valid admin token. You only send the fields you want to change; missing fields stay as-is.

//req.params is an object Express builds from the URL path parameters. For a route like PUT /api/events/:id, when the URL is /api/events/42, req.params is { id: "42" }. You destructure from it to get the id value.
//Any clientId sent in the request is simply not used (should not be changed)
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
    adminId,
    status,
  } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
  return res.status(400).json({ message: "No fields to update" });
}

//if a status was provided and it’s not one of pending|accepted|rejected--> error.
  if (status && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
// both startsAt and endsAt were provided, ensure they’re valid dates and endsAt is after startsA
  if (startsAt && endsAt) {
    if (!HAS_TIME.test(String(startsAt)) || !HAS_TIME.test(String(endsAt))) {
      return res.status(400).json({ message: "startsAt and endsAt must include a time (e.g., 2026-06-15T09:00:00Z)" });
    }
    const now = new Date();
    const start = new Date(startsAt);
    const end = new Date(endsAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid dates" });
    }

    if (start < now || end < now) {
      return res.status(400).json({ message: "Dates must be in the future" });
    }

    if (start >= end) {
      return res.status(400).json({ message: "endsAt must be after startsAt" });
    }
  }

  const fields = [];
  const values = [];

  const add = (col, val, transform = (v) => v) => {
    if (typeof val !== "undefined") {
      fields.push(`${col} = ?`);
      values.push(transform(val));
    }
  };

  if (typeof title !== "undefined" && !title.trim()) {
  return res.status(400).json({ message: "Title cannot be empty" });
}
  add("title", title?.trim());
  add("type", type?.trim());
  add("description", description);
  add("location", location?.trim());
  add("startsAt", startsAt);
  add("endsAt", endsAt);
  add("venue", venue ?? null);
  add("nbOfHosts", nbOfHosts, Number);
  add("floorPlan", floorPlan ?? null);
  add("attendeesList", attendeesList ?? null);
  add("rate", rate ?? null);
  add("teamLeaderId", teamLeaderId ?? null);
  add("clothesId", clothesId ?? null);

  if (typeof status !== "undefined") {
    fields.push("status = ?");
    values.push(status);
    //Status change to accepted or rejected without adminId → adminId auto set to the acting admin
    if (["accepted", "rejected"].includes(status) && typeof adminId === "undefined") {
      fields.push("adminId = ?");
      values.push(req.user.id);
    }
  }

  if (typeof adminId !== "undefined") {
    fields.push("adminId = ?");
    values.push(adminId);
  }


  values.push(id);

  try {
    const [result] = await db.query(`UPDATE EVENTS SET ${fields.join(", ")} WHERE eventId = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated" });
  } catch (err) {
    console.error("Failed to update event", err);
    res.status(500).json({ message: "Failed to update event" });
  }
});

// Admin deletes an event
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM EVENTS WHERE eventId = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Failed to delete event", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

export default router;
