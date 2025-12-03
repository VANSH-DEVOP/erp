const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/dbConnect");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// ===================== IMPORT ROUTES =====================
const loginRoutes = require("/api/auth");
const adminRoutes = require("/api/admin");
const facultyRoutes = require("/api/faculty");
const studentRoutes = require("/api/student");

// ===================== USE ROUTES ========================
app.use("/api/auth", loginRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

// ===================== DEFAULT ROUTE =====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

// ===================== START SERVER ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
