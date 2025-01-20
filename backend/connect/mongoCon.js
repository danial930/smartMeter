const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose.connect("mongodb://localhost:27017/iotproject");
  } catch (err) {
    console.log("DB connection error", err);
  }
};

module.exports = connectDB;
