const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/dbConnect");

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Default root API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully ",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
