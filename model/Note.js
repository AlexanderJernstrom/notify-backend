const mongoose = require("mongoose");
const User = require("./User");

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    max: 100,
    required: true
  },
  body: {
    type: String,
    minlength: 5,
    max: 1000,
    required: true
  }
});

module.exports = mongoose.model("Note", NoteSchema);
