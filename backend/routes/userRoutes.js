import { Router } from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const router = Router();

// GET /api/users - Fetch all users (hosts/hostesses)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM USERS");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch users", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// GET /api/users/:id - Fetch a single user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM USERS WHERE userId = ?", [id]);
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
  const { fName, lName, email, password, phoneNb, age, gender, address, clothingSize, description } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);
  try {
 
    const [result] = await db.query(
      `INSERT INTO USERS (fName, lName, email, password, phoneNb, age, gender, address, clothingSize, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fName, lName, email, hashedPass, phoneNb, age, gender, address, clothingSize, description]
    );
    res.status(201).json({ userId: result.insertId, message: "User created" });
  } catch (err) {
    console.error("Failed to create user", err);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// PUT /api/users/:id - Update a user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fName, lName, email, phoneNb, age, gender, address, clothingSize, description, eligibility } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE USERS SET fName = ?, lName = ?, email = ?, phoneNb = ?, age = ?, gender = ?, address = ?, clothingSize = ?, description = ?, eligibility = ?
       WHERE userId = ?`,
      [fName, lName, email, phoneNb, age, gender, address, clothingSize, description, eligibility, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated" });
  } catch (err) {
    console.error("Failed to update user", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
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
