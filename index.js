const express = require("express");
const app = express();
const mongoose = require("mongoose");
const env = require("dotenv");
const bodyParser = require("body-parser");
env.config();

const userRoute = require("./routes/user");
const notesRoute = require("./routes/notes");

const PORT = process.env.PORT || 5000;

app.use(bodyParser());

app.use("/api/user", userRoute);
app.use("/api/notes", notesRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log("Server started"));
