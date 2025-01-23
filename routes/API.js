const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
let db = require("../db/db.json");
const fs = require("fs")
notes.get("/api/notes", function (req, res) {
  db = JSON.parse(fs.readFileSync("./db/db.json")) || [];
  console.log("GET",db)
  res.json(db);
});
notes.post("/api/notes", function (req, res) {
  console.log("post", req.body,db);

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

notes.delete("/api/notes", function (erq, res) {
  db = JSON.parse(fs.readFileSync("./db/db.json")) || [];

  res.json(db);
});

module.exports = notes;
