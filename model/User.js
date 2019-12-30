const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Schema;
const Note = require("./Note");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  notes: [
    {
      type: ObjectId,
      ref: "Note"
    }
  ]
});

UserSchema.methods.generateAuthToken = () => {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN);
  return token;
};

exports.User = mongoose.model("User", UserSchema);
