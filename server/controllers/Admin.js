const bcrypt = require("bcrypt");
const User = require("../models/User");
const Course = require("../models/Course");
const Offering = require("../models/Offering");
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
const addStudent = async (req, res) => {
  try {
    const { name, email, department, batch, currentSemester } = req.body;

    if (!name || !email || !department || !batch || !currentSemester) {
      return res.status(400).json({
        message:
          "Missing required fields (name, email, department, batch, currentSemester)",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const rollNo = await generateStudentRollNo(department, batch);
    const plainPassword = generateRandomPassword(10);

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const student = await User.create({
      name,
      email,
      passwordHash,
      role: "Student",
      department: department.toUpperCase(),
      rollNo,
      batch,
      currentSemester,
    });

    // Send Email
    await mailSender(
      email,
      "Your ERP Student Credentials",
      `
      <h2>Welcome to Online ERP</h2>
      <p>Your student account has been created.</p>
      <p><strong>Roll Number:</strong> ${rollNo}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${plainPassword}</p>
      <p>Please login and change your password after first login.</p>
      `
    );

    res.status(201).json({
      message: "Student created and credentials emailed",
      student,
    });
  } catch (err) {
    console.error("addStudent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= ADD FACULTY =========================
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
const addCourse = async (req, res) => {
  try {
    const { courseCode, courseName } = req.body;

    if (!courseCode || !courseName) {
      return res.status(400).json({ message: "courseCode and courseName required" });
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
    });

    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    console.error("addCourse error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= VIEW ALL COURSES =========================
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
const getAllOfferings = async (req, res) => {
  try {
    const offerings = await Offering.find()
      .populate("course", "courseCode courseName")
      .populate("instructor", "name email department");
//populate enrollments
    res.json(offerings);
  } catch (err) {
    console.error("getAllOfferings error:", err);
    res.status(500).json({ message: "Server error" });
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