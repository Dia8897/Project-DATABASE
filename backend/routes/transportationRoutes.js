import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isUserOrAdmin } from "../middleware/auth.js";

const router = Router();

// Get transportation for a specific event application
router.get("/:eventAppId", verifyToken, isUserOrAdmin, async (req, res) => {
  const { eventAppId } = req.params;

  try {
    // Check if the user has access to this eventApp
    const [appCheck] = await db.query(
      "SELECT senderId, eventId FROM EVENT_APP WHERE eventAppId = ?",
      [eventAppId]
    );

    if (!appCheck.length) {
      return res.status(404).json({ message: "Event application not found" });
    }

    const { senderId, eventId } = appCheck[0];

    // Check permissions
    if (req.user.role !== "admin" && req.user.id !== senderId) {
      // Check if user is team leader for the event
      const [tlCheck] = await db.query(
        "SELECT 1 FROM EVENTS WHERE eventId = ? AND teamLeaderId = ?",
        [eventId, req.user.id]
      );
      if (!tlCheck.length) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const [rows] = await db.query(
      "SELECT * FROM TRANSPORTATION WHERE eventAppId = ?",
      [eventAppId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Transportation not found" });
    }

    const transport = rows[0];
    res.json({
      eventAppId: transport.eventAppId,
      eventId: transport.eventID,
      vehicleCapacity: transport.vehicleCapacity,
      pickupLocation: transport.pickupLocation,
      departureTime: transport.departureTime,
      returnTime: transport.returnTime,
      payment: transport.payment,
    });
  } catch (err) {
    console.error("Failed to fetch transportation", err);
    res.status(500).json({ message: "Failed to fetch transportation" });
  }
});

// Create or update transportation for an event application
router.post("/:eventAppId", verifyToken, isUserOrAdmin, async (req, res) => {
  const { eventAppId } = req.params;
  const { vehicleCapacity, pickupLocation, departureTime, returnTime, payment } = req.body;

  // Validation
  if (!vehicleCapacity || vehicleCapacity < 1) {
    return res.status(400).json({ message: "Valid vehicleCapacity is required" });
  }
  if (!pickupLocation || !pickupLocation.trim()) {
    return res.status(400).json({ message: "pickupLocation is required" });
  }
  if (!departureTime) {
    return res.status(400).json({ message: "departureTime is required" });
  }

  try {
    // Check if the eventApp exists and is accepted
    const [appCheck] = await db.query(
      "SELECT senderId, eventId, status FROM EVENT_APP WHERE eventAppId = ?",
      [eventAppId]
    );

    if (!appCheck.length) {
      return res.status(404).json({ message: "Event application not found" });
    }

    const { senderId, eventId, status } = appCheck[0];

    if (status !== "accepted") {
      return res.status(400).json({ message: "Cannot add transportation for non-accepted application" });
    }

    // Check permissions
    if (req.user.role !== "admin" && req.user.id !== senderId) {
      // Check if user is team leader for the event
      const [tlCheck] = await db.query(
        "SELECT 1 FROM EVENTS WHERE eventId = ? AND teamLeaderId = ?",
        [eventId, req.user.id]
      );
      if (!tlCheck.length) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    // Check if transportation already exists
    const [existing] = await db.query(
      "SELECT eventAppId FROM TRANSPORTATION WHERE eventAppId = ?",
      [eventAppId]
    );

    if (existing.length > 0) {
      // Update existing
      await db.query(
        `UPDATE TRANSPORTATION SET
          vehicleCapacity = ?,
          pickupLocation = ?,
          departureTime = ?,
          returnTime = ?,
          payment = ?
         WHERE eventAppId = ?`,
        [
          vehicleCapacity,
          pickupLocation.trim(),
          departureTime,
          returnTime || null,
          payment || 0,
          eventAppId,
        ]
      );
      res.json({ message: "Transportation updated" });
    } else {
      // Insert new
      await db.query(
        `INSERT INTO TRANSPORTATION (
          eventAppId, eventID, vehicleCapacity, pickupLocation,
          departureTime, returnTime, payment
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          eventAppId,
          eventId,
          vehicleCapacity,
          pickupLocation.trim(),
          departureTime,
          returnTime || null,
          payment || 0,
        ]
      );
      res.json({ message: "Transportation created" });
    }
  } catch (err) {
    console.error("Failed to save transportation", err);
    res.status(500).json({ message: "Failed to save transportation" });
  }
});

// Delete transportation for an event application
router.delete("/:eventAppId", verifyToken, isUserOrAdmin, async (req, res) => {
  const { eventAppId } = req.params;

  try {
    // Check if the eventApp exists
    const [appCheck] = await db.query(
      "SELECT senderId, eventId FROM EVENT_APP WHERE eventAppId = ?",
      [eventAppId]
    );

    if (!appCheck.length) {
      return res.status(404).json({ message: "Event application not found" });
    }

    const { senderId, eventId } = appCheck[0];

    // Check permissions
    if (req.user.role !== "admin" && req.user.id !== senderId) {
      // Check if user is team leader for the event
      const [tlCheck] = await db.query(
        "SELECT 1 FROM EVENTS WHERE eventId = ? AND teamLeaderId = ?",
        [eventId, req.user.id]
      );
      if (!tlCheck.length) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const [result] = await db.query(
      "DELETE FROM TRANSPORTATION WHERE eventAppId = ?",
      [eventAppId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transportation not found" });
    }

    res.json({ message: "Transportation deleted" });
  } catch (err) {
    console.error("Failed to delete transportation", err);
    res.status(500).json({ message: "Failed to delete transportation" });
  }
});

export default router;
