const express = require("express");
const notes = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dbPath = path.join(__dirname, "../db/db.json");

// Fix GET request (Remove `/api` from route)
notes.get("/notes", (req, res) => {
  const data = fs.readFileSync(dbPath, "utf8");
  res.json(JSON.parse(data) || []);
});

// Fix POST request (Remove `/api` from route)
notes.post("/notes", (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) return res.status(400).json({ error: "Invalid input" });

  const newNote = { id: uuidv4(), title, text };
  const notesData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  notesData.push(newNote);
  fs.writeFileSync(dbPath, JSON.stringify(notesData, null, 2));
  res.json(newNote);
});

// Fix DELETE request (Remove `/api` from route)
notes.delete("/notes/:id", (req, res) => {
  let notesData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  notesData = notesData.filter((note) => note.id !== req.params.id);
  fs.writeFileSync(dbPath, JSON.stringify(notesData, null, 2));
  res.json({ message: "Note deleted" });
});

module.exports = notes;
