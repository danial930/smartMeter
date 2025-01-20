const mongoose = require("mongoose");

const scratchCardSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isUsed: {
      type: Boolean,
      required: true,
      default: false, // Indicates if the scratch card has been redeemed
    },
  },
  { timestamps: true }
);

const ScratchCard = mongoose.model("ScratchCard", scratchCardSchema);

module.exports = ScratchCard;
