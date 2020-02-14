const mongoose = require("mongoose");

const List = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: [
    {
      title: {
        type: String
      },
      completed: {
        type: Boolean,
        default: false
      }
    }
  ]
});

module.exports = mongoose.model("List", List);
