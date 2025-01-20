const mongoose = require("mongoose");

const rechargeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    amountRecharged: {
      type: Number,
      required: true,
      min: 0, // Ensure non-negative recharge amounts
    },
    dateOfRecharge: {
      type: Date,
      required: true,
      default: Date.now, // Defaults to the current date and time
    },
  },
  { timestamps: true }
);

const Recharge = mongoose.model("Recharge", rechargeSchema);

module.exports = Recharge;
