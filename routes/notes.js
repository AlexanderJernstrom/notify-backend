const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const Note = require("../model/Note");
const { User } = require("../model/User");

router.get("/", authenticate, async (req, res) => {
  await User.findById(req.user._id)
    .populate("notes")
    .select("notes")
    .exec((err, note) => {
      if (err) return res.status(400).send(err);
      res.send(note);
    });
});

router.post("/createNote", authenticate, async (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    body: req.body.body
  });
  const user = await User.findById(req.user._id);
  console.log(user);

  if (user.notes === null || !user.notes) {
    user.notes = [];
    user.notes.push(newNote);
  }

  user.notes.push(newNote);

  user.save().catch(err => res.send(err));

  newNote
    .save()
    .then(note => res.send(note))
    .catch(err => res.send(err));
});

router.patch("/update", authenticate, async (req, res) => {
  let oldNote = await Note.findById(req.body._id);

  oldNote.title = req.body.title;
  oldNote.body = req.body.body;

  oldNote.save().then(note => res.send(note));
});

router.delete("/delete", authenticate, async (req, res) => {
  const note = await Note.findById(req.body._id);
  note.remove((err, note) => {
    if (err) return res.status(400).send("The note could not be deleted");
    res.send(`${note.title} was succesfully deleted`);
  });
});

module.exports = router;
