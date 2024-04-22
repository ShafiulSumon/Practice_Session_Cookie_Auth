const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose.connect(process.env.mongoUri);
    console.log("MongoDB connected!");
  } catch (err) {
    console.log("Not connected\n", err);
  }
};

module.exports = connectDB;
