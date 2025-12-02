import express from "express";
import {
  addStudent,
  addFaculty,
  getAllStudents,
  getAllFaculties,
  addCourse,
  getAllCourses,
  dropCourse,
  createCourseOffering,
  getAllOfferings
} from "../controllers/Admin.js";

import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/* ========================= STUDENTS ========================= */
router.post("/add-student", auth, isAdmin, addStudent);
router.get("/students", auth, isAdmin, getAllStudents);

/* ========================= FACULTY ========================= */
router.post("/add-faculty", auth, isAdmin, addFaculty);
router.get("/faculties", auth, isAdmin, getAllFaculties);

/* ========================= COURSES ========================= */
router.post("/add-course", auth, isAdmin, addCourse);
router.get("/courses", auth, isAdmin, getAllCourses);
router.delete("/course/:courseId", auth, isAdmin, dropCourse);

/* ========================= OFFERINGS ========================= */
router.post("/create-offering", auth, isAdmin, createCourseOffering);
router.get("/offerings", auth, isAdmin, getAllOfferings);

export default router;
