import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// GET /api/events - list events with accepted host counts
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        e.eventId,
        e.title,
        e.type,
        e.description AS description,
        e.location,
        DATE(e.startsAt) AS date,
        e.nbOfHosts,
        COALESCE(app.acceptedHostsCount, 0) AS acceptedHostsCount,
        e.rate,
        NULL AS badge,             -- placeholder until you add a column
        NULL AS category,          -- placeholder until you add a column
        NULL AS dressCode,         -- placeholder until you add a column
        NULL AS shortDescription,  -- placeholder until you add a column
        NULL AS requirements,      -- placeholder until you add a column
        NULL AS imageUrl           -- placeholder until you add a column
      FROM EVENTS e
      LEFT JOIN (
        SELECT eventId, COUNT(*) AS acceptedHostsCount
        FROM EVENT_APP
        WHERE status = 'accepted'
        GROUP BY eventId
      ) app ON app.eventId = e.eventId
      ORDER BY e.startsAt ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch events", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// GET /api/events/:id - single event details
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT eventId, title, type, description, location,
              DATE(startsAt) AS date, nbOfHosts, rate
       FROM EVENTS
       WHERE eventId = ?`,
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

export default router;


