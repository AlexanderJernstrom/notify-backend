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

router.delete("/delete/:id", authenticate, async (req, res) => {
  const list = await List.findById(req.params.id);
  if (list) {
    list.remove((err, list) => {
      if (err) return res.status(404).send("List could not be deleted");
      res.status(200).send(`${list.name} was succesfully deleted`);
    });
  } else {
    res.send("List was not found");
  }
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
