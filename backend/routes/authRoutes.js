import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    let table, idField;
    if (role === 'user') { table = 'USERS'; idField = 'userId'; }
    else if (role === 'admin') { table = 'ADMINS'; idField = 'adminId'; }
    else if (role === 'client') { table = 'CLIENTS'; idField = 'clientId'; }
    else return res.status(400).json({ message: 'Invalid role' });

    const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    const user = rows[0];
    const validPass = await bcrypt.compare(password, user.password);
    // ONLY FOR TESTING PURPOSES
    // const validPass = password === user.password; // Temporary for testing

    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user[idField], role }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;
