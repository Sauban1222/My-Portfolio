const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;
const dbPath = path.join(__dirname, "contact.db");

app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
    return;
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (tableErr) => {
    if (tableErr) {
      console.error("Table creation error:", tableErr.message);
    } else {
      console.log("SQLite database ready.");
    }
  });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  const sql = `
    INSERT INTO contacts (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, email, phone || "", subject || "", message], function (err) {
    if (err) {
      console.error("Insert error:", err.message);
      return res.status(500).json({ message: "Could not save contact data." });
    }

    res.status(201).json({
      message: "Contact saved successfully.",
      id: this.lastID
    });
  });
});

app.get("/api/contacts", (req, res) => {
  db.all("SELECT * FROM contacts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch contacts." });
    }

    res.json(rows);
  });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Coffee website server running at http://localhost:${port}`);
});
