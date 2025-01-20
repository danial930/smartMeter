const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  console.log("inside signup");
  try {
    const { email, fullName, meterID, password } = req.body;

    // Validate required fields
    if (!email || !fullName || !meterID || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      email,
      fullName,
      meterID,
      meterStatus: "Connected",
      balance: 0,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    // Handle duplicate key error (e.g., unique fields like email or meterID)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate value error",
        field: Object.keys(error.keyValue)[0],
      });
    }

    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = signup;
