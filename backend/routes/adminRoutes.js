import { Router } from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import { verifyToken, isAdmin } from "../middleware/auth.js";
// import { verify } from "jsonwebtoken";

const router = Router();

// GET pending event requests (must be before /:id to avoid route conflict)
router.get("/event-requests", verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM EVENTS WHERE status = 'pending'");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch event requests", err);
    res.status(500).json({ message: "Failed to fetch event requests" });
  }
});

// GET /api/users - Fetch all users (hosts/hostesses)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ADMINS");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch admins", err);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
});

// GET /api/users/:id - Fetch a single user by ID
router.get("/:id", verifyToken, isAdmin, async (req, res) => {
   const requestedId = parseInt(req.params.id, 10);
  if (Number.isNaN(requestedId)) {
    return res.status(400).json({ message: "Invalid admin id" });
  }
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM ADMINS WHERE adminId = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch admin", err);
    res.status(500).json({ message: "Failed to fetch admin" });
  }
});

// POST /api/users - Create a new user
// router.post("/", verifyToken, isAdmin, async (req, res) => {
//   const { fName, lName, email, password, phoneNb, profilePic, age, gender,
//  address, yearsOfExperience } = req.body;
//  const hashedPass = await bcrypt.hash(password, 10);
//   try {
    
//     const [result] = await db.query(
//       `INSERT INTO ADMINS (fName, lName, email, password, phoneNb, profilePic, age, gender,
//  address, yearsOfExperience)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [fName, lName, email, hashedPass, phoneNb, profilePic, age, gender,
//  address, yearsOfExperience]
//     );
//     res.status(201).json({ adminId: result.insertId, message: "Admin created" });
//   } catch (err) {
//     console.error("Failed to create admin", err);
//     res.status(500).json({ message: "Failed to create admin" });
//   }
// });

router.post("/", async (req, res) => {
  const validationErrors = validateAdminPayload(req.body);
  if (validationErrors.length) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const { fName, lName, email, password, phoneNb, profilePic, age, gender, address, yearsOfExperience } = req.body;

  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO ADMINS (fName, lName, email, password, phoneNb, profilePic, age, gender, address, yearsOfExperience)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fName.trim(),
        lName.trim(),
        email.trim(),
        hashedPass,
        phoneNb.trim(),
        profilePic?.trim() || null,
        Number(age),
        gender.trim(),
        address.trim(),
        Number(yearsOfExperience)
      ]
    );
    res.status(201).json({ adminId: result.insertId, message: "Admin created" });
  } catch (err) {
    handleDbError(err, res, "Failed to create admin");
  }
});


// PUT /api/users/:id - Update a user
// router.put("/:id", verifyToken, isAdmin, async (req, res) => {
//   const { id } = req.params;
//   const { fName, lName, email, password, phoneNb, profilePic, age, gender,
//  address, yearsOfExperience } = req.body;
//   try {
//     const [result] = await db.query(
//       `UPDATE ADMINS SET fName = ?, lName = ?, email = ?, password = ?, phoneNb = ?, profilePic = ?, age = ?, gender = ?, address = ?, yearsOfExperience = ?
//        WHERE adminId = ?`,
//       [fName, lName, email, password, phoneNb, profilePic, age, gender,
//  address, yearsOfExperience, id]
//     );
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     res.json({ message: "Admin updated" });
//   } catch (err) {
//     console.error("Failed to update admin", err);
//     res.status(500).json({ message: "Failed to update admin" });
//   }
// });


router.put("/:id", verifyToken, async (req, res) => {
  const requestedId = parseInt(req.params.id, 10);
  if (Number.isNaN(requestedId)) {
    return res.status(400).json({ message: "Invalid admin id" });
  }

  // Admin can only update their own info
  if (req.user.id !== requestedId) {
    return res.status(403).json({ message: "Access denied: can only update your own information" });
  }   

  try {
    const [existingRows] = await db.query("SELECT * FROM ADMINS WHERE adminId = ?", [requestedId]);
    if (!existingRows.length) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const currentAdmin = existingRows[0];
    const payload = {
      fName: req.body.fName ?? currentAdmin.fName,
      lName: req.body.lName ?? currentAdmin.lName,
      email: req.body.email ?? currentAdmin.email,
      phoneNb: req.body.phoneNb ?? currentAdmin.phoneNb,
      profilePic: req.body.profilePic ?? currentAdmin.profilePic,
      age: req.body.age ?? currentAdmin.age,
      gender: req.body.gender ?? currentAdmin.gender,
      address: req.body.address ?? currentAdmin.address,
      yearsOfExperience: req.body.yearsOfExperience ?? currentAdmin.yearsOfExperience,
    };

    // Handle password separately
    let hashedPassword = currentAdmin.password;
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
      }
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    const validationErrors = validateAdminPayload(payload, { requirePassword: false });
    if (validationErrors.length) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const [result] = await db.query(
      `UPDATE ADMINS SET fName = ?, lName = ?, email = ?, password = ?, phoneNb = ?, profilePic = ?, age = ?, gender = ?, address = ?, yearsOfExperience = ?
       WHERE adminId = ?`,
      [
        payload.fName.trim(),
        payload.lName.trim(),
        payload.email.trim(),
        hashedPassword,
        payload.phoneNb.trim(),
        payload.profilePic?.trim() || null,
        Number(payload.age),
        payload.gender.trim(),
        payload.address.trim(),
        Number(payload.yearsOfExperience),
        requestedId,
      ]
    );

    res.json({ message: "Admin updated" });
  } catch (err) {
    handleDbError(err, res, "Failed to update admin");
  }
});

// DELETE /api/admins/:id - Delete admin
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const requestedId = parseInt(req.params.id, 10);
  if (Number.isNaN(requestedId)) {
    return res.status(400).json({ message: "Invalid admin id" });
  }

  try {
    // Check if admin has processed any applications
    const [appCheck] = await db.query("SELECT COUNT(*) as count FROM EVENT_APP WHERE adminId = ?", [requestedId]);
    if (appCheck[0].count > 0) {
      return res.status(409).json({
        message: "Cannot delete admin who has processed applications. Reassign or delete the applications first.",
        applicationsCount: appCheck[0].count
      });
    }

    const [result] = await db.query("DELETE FROM ADMINS WHERE adminId = ?", [requestedId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted" });
  } catch (err) {
    handleDbError(err, res, "Failed to delete admin");
  }
});

const validateAdminPayload = (body, { requirePassword = true } = {}) => {
  const errors = [];
  const allowedGenders = ["M", "F", "Other"];

  const {
    fName, lName, email, password, phoneNb, profilePic, age, gender,
    address, yearsOfExperience
  } = body;

  if (!fName || !fName.trim()) errors.push("First name is required.");
  if (!lName || !lName.trim()) errors.push("Last name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Valid email is required.");
  if (requirePassword && (!password || password.length < 6))
    errors.push("Password must be at least 6 characters.");
  if (!phoneNb || !phoneNb.trim()) errors.push("Phone number is required.");

  const ageValue = Number(age);
  if (Number.isNaN(ageValue) || ageValue < 21 || ageValue > 80) {
    errors.push("Age must be between 21 and 80.");
  }

  const genderValue = gender?.trim();
  if (!genderValue) {
    errors.push("Gender is required.");
  } else if (!allowedGenders.includes(genderValue)) {
    errors.push("Gender must be M, F, or Other.");
  }

  if (!address || !address.trim()) errors.push("Address is required.");
  
  const expValue = Number(yearsOfExperience);
  if (Number.isNaN(expValue) || expValue < 0 || expValue > 50) {
    errors.push("Years of experience must be between 0 and 50.");
  }

  return errors;
};

const handleDbError = (err, res, defaultMessage) => {
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Email already exists." });
  }
  console.error(defaultMessage, err);
  return res.status(500).json({ message: defaultMessage });
};

// GET pending event requests
router.get("/event-requests", verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM EVENTS WHERE status = 'pending'");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch event requests", err);
    res.status(500).json({ message: "Failed to fetch event requests" });
  }
});

// Approve event request
router.put("/event-requests/:id/approve", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "UPDATE EVENTS SET status = 'accepted', adminId = ? WHERE eventId = ? AND status = 'pending'",
      [req.user.id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event request not found or already processed" });
    }
    res.json({ message: "Event approved" });
  } catch (err) {
    console.error("Failed to approve event", err);
    res.status(500).json({ message: "Failed to approve event" });
  }
});

// Reject event request
router.put("/event-requests/:id/reject", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "UPDATE EVENTS SET status = 'rejected', adminId = ? WHERE eventId = ? AND status = 'pending'",
      [req.user.id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event request not found or already processed" });
    }
    res.json({ message: "Event rejected" });
  } catch (err) {
    console.error("Failed to reject event", err);
    res.status(500).json({ message: "Failed to reject event" });
  }
});

export default router;
