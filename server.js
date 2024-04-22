const express = require("express");
const session = require("express-session");
const MongoDbSession = require("connect-mongodb-session")(session);
const dotenv = require("dotenv").config();
const router = require("./routers");
const connectDB = require("./db");

const app = express();

connectDB();

const store = new MongoDbSession({
  uri: process.env.mongoUri,
  collection: "sessions",
});

app.use(
  session({
    secret: "some-secret-key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", router);

app.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
