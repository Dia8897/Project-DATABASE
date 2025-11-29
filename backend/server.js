import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME"];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.warn(`Missing environment variable: ${key}`);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const db = pool.promise();

db.query("SELECT 1")
  .then(() => console.log("Connected to MySQL"))
  .catch(err => console.error("DB connection error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/health/db", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ status: "error" });
  }
});

app.post("/applications", async (req, res) => {
  const { fullName, email, program } = req.body;

  if (!fullName || !email || !program) {
    return res
      .status(400)
      .json({ error: "fullName, email, and program are required." });
  }

  try {
    const [result] = await db.execute(
      `
        INSERT INTO applications (full_name, email, program, status)
        VALUES (?, ?, ?, 'pending')
      `,
      [fullName, email, program]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Application submitted. Status is pending review.",
    });
  } catch (error) {
    console.error("Failed to save application:", error);
    res.status(500).json({ error: "Unable to submit application right now." });
  }
});

app.get("/applications/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
        SELECT
          id,
          full_name AS fullName,
          email,
          program,
          status,
          created_at AS createdAt
        FROM applications
        WHERE id = ?
      `,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Failed to fetch application:", error);
    res.status(500).json({ error: "Unable to fetch application." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
