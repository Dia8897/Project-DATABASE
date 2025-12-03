import { Router } from "express";
import db from "../config/db.js";
import { verifyToken, isAdmin, isUserOrAdmin } from "../middleware/auth.js";
import bcrypt from "bcryptjs";

const router = Router();

const validateUserPayload = (body, { requirePassword = true } = {}) => {
  const errors = [];
  const allowedGenders = ["M", "F", "Other"];
  const allowedClothingSizes = ["XS", "S", "M", "L", "XL"];

  const {
    fName,
    lName,
    email,
    password,
    phoneNb,
    age,
    gender,
    address,
    clothingSize,
    description,
  } = body;

  if (!fName || !fName.trim()) errors.push("First name is required.");
  if (!lName || !lName.trim()) errors.push("Last name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Valid email is required.");
  if (requirePassword && (!password || password.length < 6))
    errors.push("Password must be at least 6 characters.");
  if (!phoneNb || !phoneNb.trim()) errors.push("Phone number is required.");

  const ageValue = Number(age);
  if (
    Number.isNaN(ageValue) ||
    ageValue < 18 ||
    ageValue > 80
  ) {
    errors.push("Age must be between 18 and 80.");
  }

  const genderValue = gender?.trim();
  if (!genderValue) {
    errors.push("Gender is required.");
  } else if (!allowedGenders.includes(genderValue)) {
    errors.push("Gender must be M, F, or Other.");
  }

  if (!address || !address.trim()) errors.push("Address is required.");
  const clothingValue = clothingSize?.trim();
  if (!clothingValue) {
    errors.push("Clothing size is required.");
  } else if (!allowedClothingSizes.includes(clothingValue)) {
    errors.push("Clothing size must be one of XS, S, M, L, XL.");
  }
  if (!description || !description.trim())
    errors.push("Description is required.");

  return errors;
};

const handleDbError = (err, res, defaultMessage) => {
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Email already exists." });
  }
  console.error(defaultMessage, err);
  return res.status(500).json({ message: defaultMessage });
};

// GET /api/users - Fetch all users (hosts/hostesses)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM USERS");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch users", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// GET /api/users/:id - Fetch a single user by ID
router.get("/:id", verifyToken, isUserOrAdmin, async (req, res) => {
  const requestedId = parseInt(req.params.id, 10);
  if (Number.isNaN(requestedId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.user.role !== "admin" && req.user.id !== requestedId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM USERS WHERE userId = ?", [
      requestedId,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch user", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// POST /api/users - Create a new user
router.post("/", async (req, res) => {
  const validationErrors = validateUserPayload(req.body);
  if (validationErrors.length) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  const {
    fName,
    lName,
    email,
    password,
    phoneNb,
    age,
    gender,
    address,
    clothingSize,
    description,
  } = req.body;

  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO USERS (fName, lName, email, password, phoneNb, age, gender, address, clothingSize, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fName.trim(),
        lName.trim(),
        email.trim(),
        hashedPass,
        phoneNb.trim(),
        Number(age),
          gender.trim(),
        address.trim(),
        clothingSize.trim(),
        description.trim(),
      ]
    );
    res.status(201).json({ userId: result.insertId, message: "User created" });
  } catch (err) {
    handleDbError(err, res, "Failed to create user");
  }
});

// PUT /api/users/:id - Update a user
router.put("/:id", verifyToken, isUserOrAdmin, async (req, res) => {
  const requestedId = parseInt(req.params.id, 10);
  if (Number.isNaN(requestedId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.user.role !== "admin" && req.user.id !== requestedId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const [existingRows] = await db.query(
      "SELECT * FROM USERS WHERE userId = ?",
      [requestedId]
    );
    if (!existingRows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = existingRows[0];
    const payload = {
      fName: req.body.fName ?? currentUser.fName,
      lName: req.body.lName ?? currentUser.lName,
      email: req.body.email ?? currentUser.email,
      phoneNb: req.body.phoneNb ?? currentUser.phoneNb,
      age: req.body.age ?? currentUser.age,
      gender: req.body.gender ?? currentUser.gender,
      address: req.body.address ?? currentUser.address,
      clothingSize: req.body.clothingSize ?? currentUser.clothingSize,
      description: req.body.description ?? currentUser.description,
    };

    let updatedEligibility = currentUser.eligibility;
    if (typeof req.body.eligibility !== "undefined") {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Only admins can change eligibility." });
      }
      const normalizedEligibility = String(req.body.eligibility).toLowerCase();
      const allowedEligibility = ["pending", "approved", "blocked"];
      if (!allowedEligibility.includes(normalizedEligibility)) {
        return res.status(400).json({
          message: "Validation failed",
          errors: ["Eligibility must be pending, approved, or blocked."],
        });
      }
      updatedEligibility = normalizedEligibility;
    }

    const validationErrors = validateUserPayload(payload, {
      requirePassword: false,
    });
    if (validationErrors.length) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const [result] = await db.query(
      `UPDATE USERS SET fName = ?, lName = ?, email = ?, phoneNb = ?, age = ?, gender = ?, address = ?, clothingSize = ?, description = ?, eligibility = ?
       WHERE userId = ?`,
      [
        payload.fName.trim(),
        payload.lName.trim(),
        payload.email.trim(),
        payload.phoneNb.trim(),
        Number(payload.age),
        payload.gender.trim(),
        payload.address.trim(),
        payload.clothingSize.trim(),
        payload.description.trim(),
        updatedEligibility,
        requestedId,
      ]
    );

    res.json({ message: "User updated" });
  } catch (err) {
    handleDbError(err, res, "Failed to update user");
  }
});

// DELETE /api/users/:id - Delete a user
router.delete("/:id", verifyToken, isUserOrAdmin, async (req, res) => {
  const { id } = req.params;
  const requestedId = parseInt(id, 10);
  if (Number.isNaN(requestedId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.user.role !== "admin" && req.user.id !== requestedId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const [result] = await db.query("DELETE FROM USERS WHERE userId = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Failed to delete user", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
