const User = require("../models/userSchema");

const getUser = async (req, res) => {
  console.log("inside login");
  try {
    const { email } = req.body;
    console.log(email);

    // Check if the user with the given email exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(existingUser);
    // Successful login
    res.status(200).json({
      existingUser,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getUser;
