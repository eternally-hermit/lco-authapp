require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
require("./config/database").connect();
const User = require("./models/user");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Requested!");
  res.status(200).send("<h1>Hello From auth systems - LCO</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      res.status(400).send("All fields are required...!");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(401).send("User already exists");
    }

    const myEncPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email.toLowerCase(),
      password: myEncPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    user = await user.save();

    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All Fields are required!");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      user.password = undefined;
      res.status(200).json(user);
    }

    res.status(400).send("Email or Passowrd is incorrect!");
  } catch (error) {
    console.error(error);
  }
});

app.get("/dashboard", auth, (req, res) => {
  res.status(200).send("Secret Information");
});

module.exports = app;
