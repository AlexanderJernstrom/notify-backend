const express = require("express");
const app = express();
const mongoose = require("mongoose");
const env = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
env.config();

const userRoute = require("./routes/user");
const notesRoute = require("./routes/notes");
const listRoute = require("./routes/lists");

const PORT = process.env.PORT || 5000;

app.use(bodyParser());
app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/notes", notesRoute);
app.use("/api/lists", listRoute);

console.log(process.env.MONGO_URI)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log("Server started"));
