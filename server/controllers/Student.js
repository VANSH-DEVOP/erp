// controllers/studentController.js
import User from "../models/User.js";
import Offering from "../models/Offering.js";
import Enrollment from "../models/Enrollment.js";

/* =========================================================================
   1) Get logged-in student profile
   Route: GET /api/student/me
   ========================================================================= */
export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await User.findById(studentId).select("-passwordHash");
    if (!student || student.role !== "Student") {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ student });
  } catch (err) {
    console.error("getStudentProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================================
   2) Get all current course offerings for student's dept + semester
   Route: GET /api/student/current-offerings
   ========================================================================= */
export const getCurrentOfferings = async (req, res) => {
  try {
    const studentId = req.user._id;
    const student = await User.findById(studentId);

    if (!student || student.role !== "Student") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.currentSemester || !student.department) {
      return res.status(400).json({
        message:
          "Student department or current semester not set. Contact admin.",
      });
    }

    const offerings = await Offering.find({
      department: student.department.toUpperCase(),
      semester: student.currentSemester,
      status: "OPEN",
    })
      .populate("course", "courseCode courseName")
      .sort({ createdAt: -1 });

    return res.json({
      offerings: offerings.map((off) => ({
        _id: off._id,
        courseCode: off.course.courseCode,
        courseName: off.course.courseName,
        semester: off.semester,
        department: off.department,
        maxSeats: off.maxSeats,
        status: off.status,
      })),
    });
  } catch (err) {
    console.error("getCurrentOfferings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================================
   3) Register in an offering (ENROLLMENT REQUEST)
   Route: POST /api/student/register
   Body: { offeringId }
   ========================================================================= */
export const registerInOffering = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { offeringId } = req.body;

    if (!offeringId) {
      return res.status(400).json({ message: "offeringId is required" });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "Student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const offering = await Offering.findById(offeringId).populate(
      "course",
      "courseCode courseName"
    );
    if (!offering) {
      return res.status(404).json({ message: "Offering not found" });
    }

    // Ensure student registers in correct dept & semester
    if (
      offering.department !== student.department.toUpperCase() ||
      offering.semester !== student.currentSemester
    ) {
      return res.status(400).json({
        message:
          "You can only register for offerings of your department and current semester",
      });
    }

    if (offering.status !== "OPEN") {
      return res
        .status(400)
        .json({ message: "This offering is not open for registration" });
    }

    // Prevent duplicate enrollment (any status)
    const existing = await Enrollment.findOne({
      student: studentId,
      offering: offeringId,
    });

    if (existing) {
      return res.status(400).json({
        message: `You have already applied / enrolled in this offering (status: ${existing.requestStatus})`,
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      offering: offeringId,
      requestStatus: "PENDING",
    });

    return res.status(201).json({
      message: "Enrollment request submitted. Waiting for faculty approval.",
      enrollmentId: enrollment._id,
    });
  } catch (err) {
    console.error("registerInOffering error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================================
   4) Get all courses the student is part of (APPROVED enrollments)
   Route: GET /api/student/my-courses
   ========================================================================= */
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({
      student: studentId,
      requestStatus: "APPROVED",
    })
      .populate({
        path: "offering",
        populate: { path: "course", select: "courseCode courseName" },
      })
      .sort({ createdAt: -1 });

    return res.json({
      courses: enrollments.map((enr) => ({
        enrollmentId: enr._id,
        offeringId: enr.offering._id,
        courseCode: enr.offering.course.courseCode,
        courseName: enr.offering.course.courseName,
        semester: enr.offering.semester,
        department: enr.offering.department,
        instructorId: enr.offering.instructor,
      })),
    });
  } catch (err) {
    console.error("getMyCourses error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
