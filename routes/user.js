const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../model/User");
const express = require("express");
const router = express.Router();
const { registerValidation, loginValidation } = require("../validation");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.post("/", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(404).json({ error });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exists");

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    notes: []
  });
  const salt = bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  const token = user.generateAuthToken();
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token
  });
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is wrong");
  const pass = await bcrypt.compare(req.body.password, user.password);
  if (!pass) return res.status(400).send("Password is wrong");

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);

  res.header("auth-token", token).send(token);
});


router.get('/search/:email', async (req, res) => {
  const regex = new RegExp(escapeRegex(req.params.email), 'gi')
  const searchedUsers = await User.find({email: regex})
  const searchedUsersResult = searchedUsers.map(user => {
    return {name: user.name, email: user.email}
  })
  res.send(searchedUsersResult)
})

module.exports = router;
