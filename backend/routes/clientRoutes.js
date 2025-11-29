import { Router } from "express";
import db from "../config/db.js";

const router = Router();

// GET /api/users - Fetch all users (hosts/hostesses)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM CLIENTS");
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch clients", err);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
});

// GET /api/users/:id - Fetch a single user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM CLIENTS WHERE clientId = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to fetch client", err);
    res.status(500).json({ message: "Failed to fetch client" });
  }
});

// POST /api/users - Create a new client
router.post("/", async (req, res) => {
  const { fName, lName, email, phoneNb, age, gender, address } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO CLIENTS (fName, lName, email, phoneNb, age, gender, address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fName, lName, email, phoneNb, age, gender, address]
    );
    res.status(201).json({ clientId: result.insertId, message: "Client created" });
  } catch (err) {
    console.error("Failed to create client", err);
    res.status(500).json({ message: "Failed to create client" });
  }
});


router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fName, lName, email, phoneNb, age, gender, address } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE CLIENTS SET fName = ?, lName = ?, email = ?, phoneNb = ?, age = ?, gender = ?, address = ?
       WHERE clientId = ?`,
      [fName, lName, email, phoneNb, age, gender, address, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({ message: "Client updated" });
  } catch (err) {
    console.error("Failed to update client", err);
    res.status(500).json({ message: "Failed to update client" });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM CLIENTS WHERE clientId = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({ message: "Client deleted" });
  } catch (err) {
    console.error("Failed to delete client", err);
    res.status(500).json({ message: "Failed to delete client" });
  }
});

export default router;
