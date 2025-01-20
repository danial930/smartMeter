const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  console.log("inside login");
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the user with the given email exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Successful login
    res.status(200).json({
      message: "Login successful",
      user: { existingUser },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = login;
