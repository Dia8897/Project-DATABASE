import { Router } from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const router = Router();

// GET /api/users - Fetch all users (hosts/hostesses)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ADMINS");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch admins", err);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
});

// GET /api/users/:id - Fetch a single user by ID
router.get("/:id", async (req, res) => {
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
router.post("/", async (req, res) => {
  const { fName, lName, email, password, phoneNb, profilePic, age, gender,
 address, yearsOfExperience } = req.body;
 const hashedPass = await bcrypt.hash(password, 10);
  try {
    
    const [result] = await db.query(
      `INSERT INTO ADMINS (fName, lName, email, password, phoneNb, profilePic, age, gender,
 address, yearsOfExperience)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fName, lName, email, hashedPass, phoneNb, profilePic, age, gender,
 address, yearsOfExperience]
    );
    res.status(201).json({ adminId: result.insertId, message: "Admin created" });
  } catch (err) {
    console.error("Failed to create admin", err);
    res.status(500).json({ message: "Failed to create admin" });
  }
});

// PUT /api/users/:id - Update a user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fName, lName, email, password, phoneNb, profilePic, age, gender,
 address, yearsOfExperience } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE ADMINS SET fName = ?, lName = ?, email = ?, password = ?, phoneNb = ?, profilePic = ?, age = ?, gender = ?, address = ?, yearsOfExperience = ?
       WHERE adminId = ?`,
      [fName, lName, email, password, phoneNb, profilePic, age, gender,
 address, yearsOfExperience, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin updated" });
  } catch (err) {
    console.error("Failed to update admin", err);
    res.status(500).json({ message: "Failed to update admin" });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM ADMINS WHERE adminId = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted" });
  } catch (err) {
    console.error("Failed to delete admin", err);
    res.status(500).json({ message: "Failed to delete admin" });
  }
});

export default router;
