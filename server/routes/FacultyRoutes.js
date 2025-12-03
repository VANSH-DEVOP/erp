import express from "express";
import {
  getFacultyDetails,
  getMyOfferings,
  getStudentsInOffering,
  getCourseEnrollmentRequests,
  approveEnrollmentRequest,
  rejectEnrollmentRequest
} from "../controllers/Faculty.js";

import { auth, isFaculty } from "../middleware/auth.js";

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

export default router;
