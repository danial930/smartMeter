const Recharge = require("../models/rechargeSchema"); // Adjust the path as necessary

// Updated route to fetch recharge history for a specific user
const getHistory = async (req, res) => {
  const { email } = req.body; // Accept email from request body
  if (!email) {
    return res.status(400).json({ message: "Email is required" }); // Validate email presence
  }

  try {
    console.log("inside history");
    const history = await Recharge.find({ email });

    if (!history) {
      res.send(401).json({ message: "no history found" });
    } // Fetch recharge records for the specific email
    res.status(200).json(history); // Send the history as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching recharge history", error });
  }
};

module.exports = getHistory;
