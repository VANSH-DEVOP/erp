const express = require("express");
const {
  getFacultyDetails,
  getMyOfferings,
  getStudentsInOffering,
  getCourseEnrollmentRequests,
  approveEnrollmentRequest,
  rejectEnrollmentRequest
} = require("../controllers/Faculty.js");

const { auth } = require("../middleware/auth.js");
const {isFaculty} = require("../middleware/roles.js");

const router = express.Router();

/* ========================= PROFILE ========================= */
router.get("/me", auth, isFaculty, getFacultyDetails);

/* ========================= OFFERINGS ========================= */
router.get("/my-offerings", auth, isFaculty, getMyOfferings);

/* ========================= OFFERING STUDENTS ========================= */
router.get("/offerings/:offeringId/students", auth, isFaculty, getStudentsInOffering);

/* ========================= PENDING REQUESTS ========================= */
router.get("/requests/course", auth, isFaculty, getCourseEnrollmentRequests);

/* ========================= APPROVE REQUEST ========================= */
router.post("/requests/approve", auth, isFaculty, approveEnrollmentRequest);

/* ========================= REJECT REQUEST ========================= */
router.post("/requests/reject", auth, isFaculty, rejectEnrollmentRequest);

module.exports = router;
