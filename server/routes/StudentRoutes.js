import express from "express";
import {
  getStudentProfile,
  getCurrentOfferings,
  registerInOffering,
  getMyCourses
} from "../controllers/Student.js";

import { auth, isStudent } from "../middleware/auth.js";

const router = express.Router();

/* ========================= PROFILE ========================= */
router.get("/me", auth, isStudent, getStudentProfile);

/* ========================= OFFERINGS ========================= */
router.get("/current-offerings", auth, isStudent, getCurrentOfferings);

/* ========================= REGISTER ========================= */
router.post("/register", auth, isStudent, registerInOffering);

/* ========================= APPROVED COURSES ========================= */
router.get("/my-courses", auth, isStudent, getMyCourses);

export default router;
