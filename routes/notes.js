const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const Note = require("../model/Note");
const { User } = require("../model/User");
const List = require("../model/List");

router.get("/", authenticate, async (req, res) => {
  let notes = [];
  let lists = [];
  await User.findById(req.user._id)
    .populate("notes")
    .populate("lists")
    .select("notes lists")
    .exec((err, response) => {
      if (err) return res.status(400).send(err);
      res.json({
        notes: response.notes,
        lists: response.lists
      });
    });
});

router.post("/createNote", authenticate, async (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    body: req.body.body
  });
  const user = await User.findById(req.user._id).catch(err => console.log(err));
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

router.post("/share", async (req, res) => {
  const note = await Note.findById(req.body._id);
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.send("User with that email does not exist");
  }

  const newNote = new Note({
    title: note.title,
    body: note.body
  });

  user.notes.push(newNote);

  user.save().catch(err => res.send(err));

  newNote
    .save()
    .then(note =>
      res.send(`"${note.title}" was succesfully shared to ${user.email}`)
    );
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
