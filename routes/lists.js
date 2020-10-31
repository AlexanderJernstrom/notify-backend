const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const List = require("../model/List");
const { User } = require("../model/User");
const puppeteer = require("puppeteer");

router.post("/create", authenticate, async (req, res) => {
  const newList = new List({
    name: req.body.name,
    items: req.body.items,
  });

  const user = await User.findById(req.user._id);
  user.lists.push(newList);

  user.save().catch((err) => res.send(err));

  newList
    .save()
    .then((list) => res.send(list))
    .catch((err) => res.send(err));
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

router.get("/importRecipe", authenticate, async (req, res) => {
  const url = req.query.recipeURL;
  let browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  let page = await browser.newPage();

  await page.goto(url);

  const name = "";

  const data = await page.evaluate(() => {
    const json = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    if (!json) res.json("The recipe could not be found");
    let result = [];
    json.forEach((obj) => {
      result.push(JSON.parse(obj.innerHTML));
    });
    return result;
  });
  await browser.close();

  let result = [];

  data.forEach((obj) => {
    //Check if it has the metadata on the "first level" of the object
    if (obj.recipeIngredient) {
      return res.json(obj.recipeIngredient);
    }
    if (obj.name) {
      name = obj.name;
    }
    if (!obj.name) {
      name = `Recipe ${Math.floor(Math.random * 20)}`;
    }

    // If that is not true we have to extract the recipe from plain text
    const string = JSON.stringify(obj);
    const searchedStr = string.search("recipeIngredient");
    if (searchedStr === -1) return res.json("Recipe could't not be extracted");
    const subString = string.substring(searchedStr, searchedStr + 400);
    const insideBrackets = subString.match(/\[.*?\]/g);
    console.log(insideBrackets);
    result = JSON.parse(insideBrackets);
  });

  const newList = new List({
    items: result,
    name,
  });

  const user = await User.findById(req.user._id);
  user.lists.push(newList);

  user.save().catch((err) => res.send(err));

  newList
    .save()
    .then((list) => res.send(list))
    .catch((err) => res.send(err));

  return res.json(newList);

  /*res.json({
    ingredients: ingredients.recipeIngredient,
    instuctions: ingredients.recipeInstructions,
  });*/
});

router.patch("/edit", authenticate, async (req, res) => {
  let list = await List.findById(req.body._id);
  const newList = req.body.list;
  list.name = newList.name;
  list.items = newList.items;

  list
    .save()
    .then((list) => res.send(list))
    .catch((err) => res.send(err));
});

module.exports = router;
