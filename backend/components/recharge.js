const express = require("express");
const ScratchCard = require("../models/scratchCardSchema");
const User = require("../models/userSchema");
const Recharge = require("../models/rechargeSchema");

const recharge = async (req, res) => {
  const { cardNumber, email } = req.body; // Assuming userId is sent in the request

  console.log(cardNumber, email);

  try {
    // Check if the scratch card exists and is not used
    const scratchCard = await ScratchCard.findOne({ cardNumber });
    console.log("done");
    if (!scratchCard) {
      return res.status(404).json({ message: "Scratch card not found." });
    }
    if (scratchCard.isUsed) {
      return res
        .status(400)
        .json({ message: "The card number is already used." });
    }

    // Increment the user's balance
    const user = await User.findOne({ email });
    console.log("done");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let newBalance = user.balance;
    newBalance += scratchCard.amount;
    user.balance += scratchCard.amount; // Increment balance
    await user.save();

    // Mark the scratch card as used
    scratchCard.isUsed = true;
    await scratchCard.save();

    // Log the recharge
    const recharge = new Recharge({
      email: user.email,
      amountRecharged: scratchCard.amount,
      dateOfRecharge: new Date(),
    });
    await recharge.save();

    console.log(recharge);

    return res
      .status(200)
      .json({ message: "Scratch card redeemed successfully.", newBalance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred.", error });
  }
};

module.exports = recharge;

// ... existing code ...
