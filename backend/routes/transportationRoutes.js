import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isUserOrAdmin } from "../middleware/auth.js";
import { buildTransportationSummary } from "../utils/transportation.js";

const router = Router();

const fetchEventMeta = async (eventId) => {
  const [rows] = await db.query(
    "SELECT eventId, nbOfHosts, teamLeaderId FROM EVENTS WHERE eventId = ?",
    [eventId]
  );
  return rows[0] || null;
};

const ensureEventAccess = async (eventId, user) => {
  const event = await fetchEventMeta(eventId);
  if (!event) {
    return { allowed: false, reason: "Event not found" };
  }

  if (user.role === "admin") {
    return { allowed: true, event };
  }

  if (user.role !== "user") {
    return { allowed: false, reason: "Access denied" };
  }

  if (event.teamLeaderId === user.id) {
    return { allowed: true, event };
  }

  const [assignment] = await db.query(
    `SELECT 1
       FROM EVENT_APP
      WHERE eventId = ?
        AND senderId = ?
        AND status = 'accepted'`,
    [eventId, user.id]
  );

  if (assignment.length) {
    return { allowed: true, event };
  }

  return { allowed: false, reason: "Access denied" };
};

router.get("/:eventId", verifyToken, isUserOrAdmin, async (req, res) => {
  const eventId = Number(req.params.eventId);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).json({ message: "Invalid event id" });
  }

  try {
    const { allowed, event, reason } = await ensureEventAccess(eventId, req.user);
    if (!allowed) {
      return res.status(reason === "Event not found" ? 404 : 403).json({ message: reason });
    }

    const summary = await buildTransportationSummary(eventId, event.nbOfHosts);
    res.json(summary);
  } catch (err) {
    console.error("Failed to fetch transportation", err);
    res.status(500).json({ message: "Failed to fetch transportation" });
  }
});

router.post("/:eventId", verifyToken, isAdmin, async (req, res) => {
  const eventId = Number(req.params.eventId);
  const { pickupLocation, departureTime, returnTime, payment } = req.body || {};

  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).json({ message: "Invalid event id" });
  }
  if (!pickupLocation || !pickupLocation.trim()) {
    return res.status(400).json({ message: "pickupLocation is required" });
  }
  if (!departureTime) {
    return res.status(400).json({ message: "departureTime is required" });
  }
  if (returnTime && new Date(returnTime) < new Date(departureTime)) {
    return res.status(400).json({ message: "returnTime must be after departureTime" });
  }

  const sanitizedPayment = Number(payment ?? 0);
  if (Number.isNaN(sanitizedPayment) || sanitizedPayment < 0) {
    return res.status(400).json({ message: "payment must be a positive number" });
  }

  try {
    const event = await fetchEventMeta(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const [existing] = await db.query(
      "SELECT transportationId FROM TRANSPORTATION WHERE eventId = ?",
      [eventId]
    );

    if (existing.length) {
      await db.query(
        `UPDATE TRANSPORTATION
            SET pickupLocation = ?,
                departureTime = ?,
                returnTime = ?,
                payment = ?
          WHERE eventId = ?`,
        [
          pickupLocation.trim(),
          departureTime,
          returnTime || null,
          sanitizedPayment,
          eventId,
        ]
      );
    } else {
      await db.query(
        `INSERT INTO TRANSPORTATION (eventId, pickupLocation, departureTime, returnTime, payment)
         VALUES (?, ?, ?, ?, ?)`,
        [eventId, pickupLocation.trim(), departureTime, returnTime || null, sanitizedPayment]
      );
    }

    const summary = await buildTransportationSummary(eventId, event.nbOfHosts);
    res.json({ message: "Transportation saved", transportation: summary });
  } catch (err) {
    console.error("Failed to save transportation", err);
    res.status(500).json({ message: "Failed to save transportation" });
  }
});

router.delete("/:eventId", verifyToken, isAdmin, async (req, res) => {
  const eventId = Number(req.params.eventId);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).json({ message: "Invalid event id" });
  }

  try {
    const [result] = await db.query("DELETE FROM TRANSPORTATION WHERE eventId = ?", [eventId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transportation not found" });
    }
    res.json({ message: "Transportation removed" });
  } catch (err) {
    console.error("Failed to delete transportation", err);
    res.status(500).json({ message: "Failed to delete transportation" });
  }
});

export default router;
