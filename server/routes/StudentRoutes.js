const express = require("express");
const {
  getStudentProfile,
  getCurrentOfferings,
  registerInOffering,
  getMyCourses,
} = require("../controllers/Student.js");
const { auth } = require("../middleware/auth.js");
const {isStudent} = require("../middleware/roles.js");

const router = express.Router();

/* ========================= PROFILE ========================= */
router.get("/me", auth, isStudent, getStudentProfile);

/* ========================= OFFERINGS ========================= */
router.get("/current-offerings", auth, isStudent, getCurrentOfferings);

/* ========================= REGISTER ========================= */
router.post("/register", auth, isStudent, registerInOffering);

/* ========================= APPROVED COURSES ========================= */
router.get("/my-courses", auth, isStudent, getMyCourses);

module.exports = router;
