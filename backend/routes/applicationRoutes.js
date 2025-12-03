import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isUser, isUserOrAdmin } from "../middleware/auth.js";


const router = Router();


router.get("/", verifyToken, isUserOrAdmin, async (req, res) => {
  try {
    let query = "SELECT * FROM EVENT_APP";
    let params = [];

    if (req.user.role !== 'admin') {
      query += " WHERE senderId = ?";
      params.push(req.user.id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch event app", err);
    res.status(500).json({ message: "Failed to fetch event app" });
  }
});

router.get("/:id", verifyToken, isUserOrAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    let query = "SELECT * FROM EVENT_APP WHERE eventAppId = ?";
    let params = [id];

    // If not admin, ensure user can only access their own applications
    if (req.user.role !== 'admin') {
      query += " AND senderId = ?";
      params.push(req.user.id);
    }

    const [rows] = await db.query(query, params);
    if (!rows.length) {
      return res.status(404).json({ message: "Event app not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch event application", err);
    res.status(500).json({ message: "Failed to fetch event application" });
  }
});


router.post("/", verifyToken, isUser, async (req, res) => {
  try {
    const { requestedRole, notes, eventId } = req.body;

    // Validation
    if (!requestedRole || !requestedRole.trim()) {
      return res.status(400).json({ message: "requestedRole is required" });
    }
    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({ message: "Valid eventId is required" });
    }

    // Check if event exists and is approved
    const [eventCheck] = await db.query(
      "SELECT eventId FROM EVENTS WHERE eventId = ? AND status = 'accepted'",
      [parseInt(eventId)]
    );
    if (eventCheck.length === 0) {
      return res.status(400).json({ message: "Invalid event - event not found or not approved" });
    }

    // Check if user has already applied to this event
    const [existingApp] = await db.query(
      "SELECT eventAppId FROM EVENT_APP WHERE senderId = ? AND eventId = ?",
      [req.user.id, parseInt(eventId)]
    );

    if (existingApp.length > 0) {
      return res.status(409).json({ message: "You have already applied for this event" });
    }

    const [result] = await db.query(
      `INSERT INTO EVENT_APP (status, requestedRole, assignedRole, notes, sentAt, decidedAt, senderId, adminId, eventId)
       VALUES (?, ?, ?, ?, NOW(), NULL, ?, NULL, ?)`,
      ['pending', requestedRole.trim(), null, notes || null, req.user.id, parseInt(eventId)]
    );

    res.status(201).json({
      eventAppId: result.insertId,
      message: "Event application created"
    });

  } catch (err) {
    console.error("Failed to create event application", err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: "Invalid eventId - event does not exist" });
    }
    res.status(500).json({ message: "Failed to create event application" });
  }
});


router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  let { status, assignedRole, decidedAt, adminId } = req.body;

  // Use 'accepted' and 'rejected' consistently
  if (status && !['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: "Invalid status value. Must be 'accepted' or 'rejected'" });
  }
 
  // Treat empty assignedRole as undefined
  if (assignedRole === "") {
    assignedRole = undefined; 
  }

  if (adminId && (isNaN(adminId) || adminId <= 0)) {
    return res.status(400).json({ message: "Invalid adminId" });
  }

  if (assignedRole && !['host', 'team_leader'].includes(assignedRole.toLowerCase())) {
    return res.status(400).json({ message: "Invalid assignedRole. Must be 'host' or 'team_leader'" });
  }

  try {
    // First, get the current application to check status and get requestedRole, eventId, senderId
    const [currentApp] = await db.query("SELECT status, requestedRole, eventId, senderId FROM EVENT_APP WHERE eventAppId = ?", [id]);
    if (currentApp.length === 0) {
      return res.status(404).json({ message: "Event application not found" });
    }

    const currentStatus = currentApp[0].status;
    const requestedRole = currentApp[0].requestedRole;
    const eventId = currentApp[0].eventId;
    const senderId = currentApp[0].senderId;

    // Prevent changing status if already decided
    if (status && currentStatus !== 'pending' && status !== currentStatus) {
      return res.status(400).json({ 
        message: `Cannot change status from '${currentStatus}' to '${status}'. Decision has already been made.` 
      });
    }

    // Only allow status changes from pending to accepted/rejected
    if (status && currentStatus !== 'pending' && ['accepted', 'rejected'].includes(currentStatus)) {
      return res.status(400).json({
        message: "Cannot modify status of an application that has already been decided"
      });
    }

    /*
    // COMMENTED: Flexible logic allowing status changes (uncomment these blocks and comment out the active ones above if you want admins to be able to change decisions)

    // Remove these active restrictions:
    // if (status && currentStatus !== 'pending' && status !== currentStatus) {
    //   return res.status(400).json({
    //     message: `Cannot change status from '${currentStatus}' to '${status}'. Decision has already been made.`
    //   });
    // }

    // if (status && currentStatus !== 'pending' && ['accepted', 'rejected'].includes(currentStatus)) {
    //   return res.status(400).json({
    //     message: "Cannot modify status of an application that has already been decided"
    //   });
    // }

    // And add this to allow flexible status changes:
    // if (status && currentStatus !== 'pending' && status !== currentStatus) {
    //   // Allow the change but you could log it here
    //   console.log(`Admin ${req.user.id} changed status from ${currentStatus} to ${status} for application ${id}`);
    // }
    */

    

    const setParts = [];
    const values = [];

    if (status !== undefined) {
      setParts.push("status = ?");
      values.push(status);
      
      // Use 'accepted' for approval logic
      if (status === 'accepted') {
        // Check for scheduling conflicts before accepting
        const [eventData] = await db.query(
          "SELECT startsAt, endsAt FROM EVENTS WHERE eventId = ?",
          [eventId]
        );

        if (eventData.length === 0) {
          return res.status(400).json({ message: "Event not found" });
        }

        const { startsAt: newStart, endsAt: newEnd } = eventData[0];

        // Check if user has any accepted applications with overlapping dates
        const [conflicts] = await db.query(`
          SELECT ea.eventAppId, e.title, e.startsAt, e.endsAt
          FROM EVENT_APP ea
          JOIN EVENTS e ON ea.eventId = e.eventId
          WHERE ea.senderId = ? AND ea.status = 'accepted' AND ea.eventAppId != ?
          AND (
            (e.startsAt <= ? AND e.endsAt >= ?) OR
            (? <= e.endsAt AND ? >= e.startsAt)
          )
        `, [senderId, id, newStart, newStart, newEnd, newEnd]);

        if (conflicts.length > 0) {
          const conflictDetails = conflicts.map(c =>
            `${c.title} (${new Date(c.startsAt).toISOString().split('T')[0]} to ${new Date(c.endsAt).toISOString().split('T')[0]})`
          ).join(', ');
          return res.status(409).json({
            message: "Cannot accept application due to scheduling conflict",
            conflicts: conflictDetails
          });
        }

        if (assignedRole === undefined) {
          setParts.push("assignedRole = ?");
          values.push(requestedRole);
        } else {
          setParts.push("assignedRole = ?");
          values.push(assignedRole);
        }
      } else if (status === 'rejected') {
        // When rejecting, don't set assignedRole
      }
    } else if (assignedRole !== undefined) {
      // Only allow updating assignedRole for accepted applications
      if (currentStatus !== 'accepted') {
        return res.status(400).json({ message: "Cannot update assignedRole for applications that are not accepted" });
      }
      setParts.push("assignedRole = ?");
      values.push(assignedRole);
    }

    if (decidedAt !== undefined) {
      setParts.push("decidedAt = ?");
      values.push(decidedAt);
    }
    if (adminId !== undefined) {
      setParts.push("adminId = ?");
      values.push(adminId);
    }

    if (setParts.length === 0) {
      return res.status(400).json({ message: "No valid fields to update. Only status, assignedRole, decidedAt, and adminId can be updated" });
    }

    // Use 'accepted' for decision logic
    if (status && ['accepted', 'rejected'].includes(status)) {
      if (!setParts.includes("decidedAt = ?")) {
        setParts.push("decidedAt = NOW()");
      }
      if (!setParts.includes("adminId = ?")) {
        setParts.push("adminId = ?");
        values.push(req.user.id);
      }
    }

    const query = `UPDATE EVENT_APP SET ${setParts.join(', ')} WHERE eventAppId = ?`;
    values.push(id);

    const [result] = await db.query(query, values);

    res.json({ message: "Event application updated" });
  } catch (err) {
    console.error("Failed to update event application", err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: "Invalid adminId" });
    }
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
