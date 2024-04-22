const express = require("express");
const router = express.Router();
const Users = require("./models/User");
const bcrypt = require("bcrypt");
const isAuth = require("./middleware/isAuth");
const session = require("express-session");

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  let user = await Users.findOne({ email });
  console.log("user: ", user);

  if (user) {
    return res.redirect("/signup");
  }

  console.log("username: ", username);
  console.log("email: ", email);
  console.log("password: ", password);

  const hashedPassword = await bcrypt.hash(password, 17);
  console.log("hashedPassword: ", hashedPassword);

  user = new Users({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });

  if (!user) {
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.redirect("/login");
  }
  req.session.isAuth = true;
  res.redirect("/dashboard");
});

router.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

router.post("/dashboard", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
});

module.exports = router;
