const bcrypt = require("bcrypt");
const User = require("../models/User");
const Course = require("../models/Courses");
const Offering = require("../models/Offering");
const Enrollment = require("../models/Enrollment");
const mailSender = require("../utils/mailSender");

// ================== HELPERS ==================
const generateRandomPassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!&_";
  let pwd = "";
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
};

// Student Roll No → 25CSE003 

const generateStudentRollNo = async (department, batch) => {
  const deptCode = department.toUpperCase();
  const yearStr = batch.toString().slice(-2);
  const count = await User.countDocuments({
    role: "Student",
    department: deptCode,
    batch,
  });
  const serial = (count + 1).toString().padStart(3, "0");
  return `${yearStr}${deptCode}${serial}`;
};

// Faculty ID → CSE005

const generateFacultyId = async (department) => {
  const deptCode = department.toUpperCase();
  const count = await User.countDocuments({
    role: "Faculty",
    department: deptCode,
  });
  const serial = (count + 1).toString().padStart(2, "0");
  return `${deptCode}${serial}`;
};

// ========================= ADD STUDENT =========================
// /api/admin/add-student
const addStudent = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "No students received" });
    }

    const results = [];

    for (const s of students) {
      const { name, email, dept, address, phone, batch } = s;

      // can add validation if required
      const existing = await User.findOne({ email });
      if (existing) {
        results.push({ email, status: "failed", reason: "Email exists" });
        continue;
      }

      const currentSemester = 1; // default first sem when adding fresh
      const rollNo = await generateStudentRollNo(dept, batch);
      const plainPassword = generateRandomPassword(10);
      const passwordHash = await bcrypt.hash(plainPassword, 10);

      const student = await User.create({
        name,
        email,
        passwordHash,
        role: "Student",
        department: dept,
        rollNo,
        batch,
        currentSemester,
        address,
        phone,
      });

      await mailSender(
        email,
        "Your ERP Student Credentials",
        `
        <h2>Welcome to Online ERP</h2>
        <p><strong>Roll No:</strong> ${rollNo}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${plainPassword}</p>
        `
      );

      results.push({ email, status: "success" });
    }

    res.status(201).json({
      message: "Bulk student creation completed",
      results,
    });
  } catch (err) {
    console.error("addStudentsBulk error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= ADD FACULTY =========================
// /api/admin/add-faculty
const addFaculty = async (req, res) => {
  try {
    const { name, email, department, designation } = req.body;

    if (!name || !email || !department) {
      return res
        .status(400)
        .json({ message: "Missing required fields (name, email, department)" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const facultyId = await generateFacultyId(department);
    const plainPassword = generateRandomPassword(10);

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const faculty = await User.create({
      name,
      email,
      passwordHash,
      role: "Faculty",
      department: department.toUpperCase(),
      facultyId,
      designation,
    });

    await mailSender(
      email,
      "Your ERP Faculty Credentials",
      `
      <h2>Welcome to Online ERP</h2>
      <p>Your faculty account has been created.</p>
      <p><strong>Faculty ID:</strong> ${facultyId}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${plainPassword}</p>
      <p>Please login and change your password after first login.</p>
      `
    );

    res.status(201).json({
      message: "Faculty created and credentials emailed",
      faculty,
    });
  } catch (err) {
    console.error("addFaculty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= VIEW ALL STUDENTS =========================
// /api/admin/students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "Student" }).select("-passwordHash");
    res.json(students);
  } catch (err) {
    console.error("getAllStudents error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= VIEW ALL FACULTIES =========================
//  /api/admin/faculties
const getAllFaculties = async (req, res) => {
  try {
    const faculties = await User.find({ role: "Faculty" }).select("-passwordHash");
    res.json(faculties);
  } catch (err) {
    console.error("getAllFaculties error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= ADD COURSE =========================
//  /api/admin/add-course
const addCourse = async (req, res) => {
  try {
    const { courseCode, courseName, department, semester } = req.body;

    if (!courseCode || !courseName || !department || !semester) {
      return res.status(400).json({
        message: "courseCode, courseName, department and semester are required",
      });
    }

    const existing = await Course.findOne({
      courseCode: courseCode.toUpperCase(),
    });
    if (existing) {
      return res.status(400).json({ message: "Course code already exists" });
    }

    const course = await Course.create({
      courseCode: courseCode.toUpperCase(),
      courseName,
      department,
      semester,
    });

    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    console.error("addCourse error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ========================= VIEW ALL COURSES =========================
// /api/admin/courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ courseCode: 1 });
    res.json(courses);
  } catch (err) {
    console.error("getAllCourses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= DROP COURSE =========================
// /api/admin/course/:courseId
const dropCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await Course.findByIdAndDelete(courseId);
    await Offering.deleteMany({ course: courseId });

    res.json({ message: "Course and all offerings deleted" });
  } catch (err) {
    console.error("dropCourse error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= CREATE COURSE OFFERING =========================
// /api/admin/create-offering
const createCourseOffering = async (req, res) => {
  try {
    const { courseId, instructorId, semester, department, maxSeats, status } =
      req.body;

    if (!courseId || !instructorId || semester == null || !department || !maxSeats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== "Faculty") {
      return res.status(400).json({ message: "Invalid faculty ID" });
    }

    const offering = await Offering.create({
      course: courseId,
      instructor: instructorId,
      semester,
      department: department.toUpperCase(),
      maxSeats,
      status: status || "OPEN",
    });

    res.status(201).json({ message: "Offering created", offering });
  } catch (err) {
    console.error("createCourseOffering error:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Offering already exists for this course, semester & department",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= VIEW ALL OFFERINGS =========================
// /api/admin/offerings

const getAllOfferings = async (req, res) => {
  try {
    // Only OPEN offerings (admin current semester/open view)
    const offerings = await Offering.find({ status: "OPEN" })
      .populate("course", "courseCode courseName")
      .populate("instructor", "name email department facultyId") // adjust fields as per your schema
      .sort({ createdAt: -1 });

    const offeringIds = offerings.map((o) => o._id);

    // Get APPROVED enrollments for these offerings
    const enrollments = await Enrollment.find({
      offering: { $in: offeringIds },
      requestStatus: "APPROVED",
    })
      .populate("student", "rollNo name")
      .lean();

    // Group enrollments by offering
    const enrollmentMap = {};
    enrollments.forEach((enr) => {
      const key = enr.offering.toString();
      if (!enrollmentMap[key]) enrollmentMap[key] = [];
      enrollmentMap[key].push({
        roll: enr.student.rollNo,
        name: enr.student.name,
      });
    });

    // Final response shape for frontend
    const response = offerings.map((off) => ({
      id: off._id, // for React key
      courseCode: off.course.courseCode,
      courseName: off.course.courseName,
      semester: off.semester,
      dept: off.department,
      instructor: off.instructor?.name || "Unknown",
      instructorId: off.instructor?.facultyId || off.instructor?._id,
      capacity: off.maxSeats,
      enrolledStudents: enrollmentMap[off._id.toString()] || [],
    }));

    return res.json({ offerings: response });
  } catch (err) {
    console.error("getAllOfferings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addStudent,
  addFaculty,
  getAllStudents,
  getAllFaculties,
  addCourse,
  getAllCourses,
  dropCourse,
  createCourseOffering,
  getAllOfferings,
};

