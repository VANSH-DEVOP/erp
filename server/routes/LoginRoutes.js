const express = require("express");

const {
  studentLogin,
  verifyStudentOtp,
  facultyLogin,
  verifyFacultyOtp,
} = require("../controllers/Login");

const router = express.Router();

/* ============================================================
   STUDENT LOGIN + OTP
   ============================================================ */

// Step 1: Student Login → Generates OTP
router.post("/student/login", studentLogin);

// Step 2: Verify Student OTP → Generates JWT
router.post("/student/verify-otp", verifyStudentOtp);


/* ============================================================
   FACULTY LOGIN + OTP
   ============================================================ */

// Step 1: Faculty Login → Generates OTP
router.post("/faculty/login", facultyLogin);

// Step 2: Verify Faculty OTP → Generates JWT
router.post("/faculty/verify-otp", verifyFacultyOtp);


module.exports = router;
