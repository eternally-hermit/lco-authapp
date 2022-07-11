require("dotenv").config();
const bcrypt = require("bcryptjs");
const express = require("express");
require("./config/database").connect();
const User = require("./models/user");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Requested!");
  res.status(200).send("<h1>Hello From auth systems - LCO</h1>");
});

app.post("/register", async () => {
  const { firstname, lastname, email, password } = req.body;

  if (!(firstname && lastname && email && password)) {
    res.status(400).send("All fields are required...!");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(401).send("User already exists");
  }

  const myEncPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstname: firstname,
    lastname: lastname,
    email: email.toLowerCase(),
    password: myEncPassword,
  });

  console.log(user);
});

module.exports = app;
