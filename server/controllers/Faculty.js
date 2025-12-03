// controllers/facultyController.js
import User from "../models/User.js";
import Offering from "../models/Offering.js";
import Enrollment from "../models/Enrollment.js";

/*
  1) Get faculty details (current logged-in faculty)
  Route: GET /api/faculty/me
*/
export const getFacultyDetails = async (req, res) => {
  try {
    const facultyId = req.user._id;

    const faculty = await User.findById(facultyId).select("-passwordHash");
    if (!faculty || faculty.role !== "Faculty") {
      return res.status(404).json({ message: "Faculty not found" });
    }

    return res.json({ faculty });
  } catch (err) {
    console.error("getFacultyDetails error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/*
  2) Get all offerings where current faculty is instructor
  Route: GET /api/faculty/my-offerings
*/
export const getMyOfferings = async (req, res) => {
  try {
    const facultyId = req.user._id;

    const offerings = await Offering.find({ instructor: facultyId })
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
        createdAt: off.createdAt,
      })),
    });
  } catch (err) {
    console.error("getMyOfferings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/*
  3) Get all students in a specific offering
     (only if current faculty is the instructor of that offering)

  Route: GET /api/faculty/offerings/:offeringId/students
*/
export const getStudentsInOffering = async (req, res) => {
  try {
    const facultyId = req.user._id;
    const { offeringId } = req.params;

    const offering = await Offering.findById(offeringId).populate(
      "course",
      "courseCode courseName"
    );
    if (!offering) {
      return res.status(404).json({ message: "Offering not found" });
    }

    if (offering.instructor.toString() !== facultyId.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // get ALL students for this offering (pending + approved + rejected)
    const enrollments = await Enrollment.find({
      offering: offeringId,
    }).populate("student", "name email rollNo department batch currentSemester");

    return res.json({
      offering: {
        _id: offering._id,
        courseCode: offering.course.courseCode,
        courseName: offering.course.courseName,
        semester: offering.semester,
        department: offering.department,
      },
      students: enrollments.map((enr) => ({
        enrollmentId: enr._id,
        requestStatus: enr.requestStatus,
        _id: enr.student._id,
        name: enr.student.name,
        email: enr.student.email,
        rollNo: enr.student.rollNo,
        department: enr.student.department,
        batch: enr.student.batch,
        currentSemester: enr.student.currentSemester,
      })),
    });
  } catch (err) {
    console.error("getStudentsInOffering error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================================
   4) Get all PENDING enrollment requests for a specific course (for this faculty)
   Route: GET /api/faculty/requests/course/:courseId
   ========================================================================= */
export const getCourseEnrollmentRequests = async (req, res) => {
  try {
    const facultyId = req.user._id;

    // 1. Find offerings of this course taught by this faculty
    const offerings = await Offering.find({
      instructor: facultyId,
    });

    if (!offerings.length) {
      return res.status(404).json({
        message: "No offerings found for this course under current faculty",
      });
    }

    const offeringIds = offerings.map((o) => o._id);

    // 2. Find all PENDING enrollments for these offerings
    const enrollments = await Enrollment.find({
      offering: { $in: offeringIds },
      requestStatus: "PENDING",
    })
      .populate("student", "name email rollNo department batch currentSemester")
      .populate({
        path: "offering",
        populate: { path: "course", select: "courseCode courseName" },
      })
      .sort({ createdAt: -1 });

    return res.json({ enrollments });
  } catch (err) {
    console.error("getCourseEnrollmentRequests error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================================
   5) Approve a specific enrollment request
   Route: POST /api/faculty/requests/approve
   Body: { enrollmentId }
   ========================================================================= */
export const approveEnrollmentRequest = async (req, res) => {
  try {
    const facultyId = req.user._id;
    const { enrollmentId } = req.body;

    if (!enrollmentId) {
      return res.status(400).json({ message: "enrollmentId is required" });
    }

    // 1. Load enrollment and offering
    const enrollment = await Enrollment.findById(enrollmentId).populate(
      "offering"
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // 2. Make sure current faculty owns this offering
    if (enrollment.offering.instructor.toString() !== facultyId.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // 3. Check status
    if (enrollment.requestStatus === "APPROVED") {
      return res.status(400).json({ message: "Request already approved" });
    }
    if (enrollment.requestStatus === "REJECTED") {
      return res.status(400).json({ message: "Request already rejected" });
    }

    // (Optional) maxSeats check
    const approvedCount = await Enrollment.countDocuments({
      offering: enrollment.offering._id,
      requestStatus: "APPROVED",
    });
    if (approvedCount >= enrollment.offering.maxSeats) {
      return res.status(400).json({
        message: "Maximum seats reached for this course offering",
      });
    }

    // 4. Approve
    enrollment.requestStatus = "APPROVED";
    await enrollment.save();

    return res.json({ message: "Enrollment request approved successfully" });
  } catch (err) {
    console.error("approveEnrollmentRequest error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================================
   6) Reject a specific enrollment request
   Route: POST /api/faculty/requests/reject
   Body: { enrollmentId }
   ========================================================================= */
export const rejectEnrollmentRequest = async (req, res) => {
  try {
    const facultyId = req.user._id;
    const { enrollmentId } = req.body;

    if (!enrollmentId) {
      return res.status(400).json({ message: "enrollmentId is required" });
    }

    const enrollment = await Enrollment.findById(enrollmentId).populate(
      "offering"
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.offering.instructor.toString() !== facultyId.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (enrollment.requestStatus === "APPROVED") {
      return res.status(400).json({
        message: "Request already approved, cannot reject",
      });
    }
    if (enrollment.requestStatus === "REJECTED") {
      return res.status(400).json({
        message: "Request already rejected",
      });
    }

    enrollment.requestStatus = "REJECTED";
    await enrollment.save();

    return res.json({ message: "Enrollment request rejected successfully" });
  } catch (err) {
    console.error("rejectEnrollmentRequest error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
