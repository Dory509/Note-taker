const express = require("express");
const notes = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../db/db.json");

// GET all notes
notes.get("/notes", function (req, res) {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, "utf8")) || [];
    console.log("GET /notes", db);
    res.json(db);
  } catch (error) {
    res.status(500).json({ error: "Error reading notes." });
  }
});

// POST a new note
notes.post("/notes", function (req, res) {
  console.log("POST /notes", req.body);
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: "Title and text are required." });
  }

  const newNote = {
    title,
    text,
    id: uuidv4(),
  };

  try {
    let db = JSON.parse(fs.readFileSync(dbPath, "utf8")) || [];
    db.push(newNote);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(newNote);
  } catch (error) {
    res.status(500).json({ error: "Error saving note." });
  }
});

// DELETE a note
notes.delete("/notes/:id", function (req, res) {
  try {
    let db = JSON.parse(fs.readFileSync(dbPath, "utf8")) || [];
    console.log("DELETE /notes", req.params.id, db);

    db = db.filter((note) => note.id !== req.params.id);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting note." });
  }
});

module.exports = notes;