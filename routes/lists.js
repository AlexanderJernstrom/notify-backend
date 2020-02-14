const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const List = require("../model/List");
const { User } = require("../model/User");

router.post("/create", authenticate, async (req, res) => {
  const newList = new List({
    name: req.body.name,
    items: req.body.items
  });

  const user = await User.findById(req.user._id);
  user.lists.push(newList);

  user.save().catch(err => res.send(err));

  newList
    .save()
    .then(list => res.send(list))
    .catch(err => res.send(err));
});

router.patch("/edit", authenticate, async (req, res) => {
  let list = await List.findById(req.body._id);
  const newList = req.body.list;
  list.name = newList.name;
  list.items = newList.items;

  list
    .save()
    .then(list => res.send(list))
    .catch(err => res.send(err));
});

module.exports = router;
