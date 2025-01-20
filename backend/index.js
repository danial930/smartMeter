const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const connectDB = require("./connect/mongoCon");
const signup = require("./components/signup");
const login = require("./components/login");
const ScratchCard = require("./models/scratchCardSchema");
const recharge = require("./components/recharge");
const getHistory = require("./components/getHistory");
const getUser = require("./components/getData");

connectDB();
app.use(express.urlencoded({ extended: false }));

PORT = process.env.PORT || 3500;

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.get("^/$|/index", (req, res) => {
  res.send("this is index");
});

app.post("/signup", signup);
app.post("/login", login);
app.post("/recharge", recharge);
app.post("/getHistory", getHistory);
app.post("/getUser", getUser);

app.post("/scratchcards", async (req, res) => {
  console.log("inside scratch card");

  try {
    const { cardNumber, amount, isUsed } = req.body;

    // Create a new scratch card document
    const scratchCard = new ScratchCard({ cardNumber, amount, isUsed });

    // Save to the database
    await scratchCard.save();

    res.status(201).json({
      message: "Scratch card created successfully",
      data: scratchCard,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Card number must be unique" });
    } else {
      res.status(500).json({
        error: "Failed to create scratch card",
        details: error.message,
      });
    }
  }
});

app.all("*", (req, res) => {
  if (req.accepts("json")) {
    res.json({ message: "page not found" });
  } else {
    res.status(404).send("page not found");
  }
});

app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  app.listen(PORT, () => {
    console.log("server listening at port:", PORT);
  });
});
