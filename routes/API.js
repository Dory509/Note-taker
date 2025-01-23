const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
let db = require("../db/db.json");
const fs = require("fs");
notes.get("/api/notes", function (req, res) {
  db = JSON.parse(fs.readFileSync("./db/db.json")) || [];
  console.log("GET", db);
  res.json(db);
});
notes.post("/api/notes", function (req, res) {
  console.log("post", req.body);

  const { title, text } = req.body;

  const newNote = {
    title,
    text,
    id: uuidv4()
  };
  db.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(db), function (err) {
    if (err) throw err;
  });

  res.json(db);
});

notes.delete("/api/notes/:id", function (req, res) {
  let tempDB = [];
  console.log("Delete",req.params.id,db)
  for (let i = 0; i < db.length; i++) {
    if (db[i].id != req.params.id) {
      tempDB.push(db[i]);
    }
  }
  db = tempDB;
  fs.writeFileSync("./db/db.json", JSON.stringify(db), function (err) {
    if (err) throw err;
  });
  res.json(db);
});

module.exports = notes;
