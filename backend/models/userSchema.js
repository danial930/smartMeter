const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    meterID: {
      type: String,
      required: true,
      unique: true,
    },
    meterStatus: {
      type: String,
      enum: ["Connected", "Disconnected"], // Allowed values
      default: "Connected",
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
