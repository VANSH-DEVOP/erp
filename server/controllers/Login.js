const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");

// JWT helper
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// OTP helper
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ====================================================================
   1) STUDENT LOGIN ➝ rollNo + password
   — If matches Admin email/password -> login as admin (no OTP)
   ==================================================================== */
const studentLogin = async (req, res) => {
  try {
    const { rollNo, password } = req.body;

    if (!rollNo || !password)
      return res.status(400).json({ message: "rollNo and password required" });

    /* ---------------- ADMIN LOGIN BLOCK ---------------- */
    if (
      rollNo === process.env.ADMIN_ID &&
      password === process.env.ADMIN_PASSWORD
    ) {
      let admin = await User.findOne({ role: "Admin" });

      // If no admin exists, create one automatically
      if (!admin) {
        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        admin = await User.create({
          name: "Admin",
          email: 'anant.7878920052@gmail.com',
          passwordHash,
          role: "Admin",
          department: "ADMIN",
        });
      }

      const token = generateToken(admin._id);
      return res.json({
        message: "Admin login successful",
        token,
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: "Admin",
        },
      });
    }

    /* ---------------- NORMAL STUDENT LOGIN ---------------- */
    const student = await User.findOne({ rollNo, role: "Student" });
    if (!student)
      return res.status(400).json({ message: "Invalid roll number or password" });

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid roll number or password" });

    // Send OTP
    const otp = generateOtp();
    await OTP.create({ email: student.email, otp });

    return res.json({
      message: "OTP sent to your registered email",
      userId: student._id,
    });
  } catch (error) {
    console.error("studentLogin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ====================================================================
   2) VERIFY STUDENT OTP
   ==================================================================== */
const verifyStudentOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp)
      return res.status(400).json({ message: "userId and otp required" });

    const student = await User.findById(userId);
    if (!student || student.role !== "Student")
      return res.status(400).json({ message: "Invalid student" });

    const latestOtpDoc = await OTP.findOne({ email: student.email })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestOtpDoc) return res.status(400).json({ message: "OTP expired" });
    if (latestOtpDoc.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    await OTP.deleteOne({ _id: latestOtpDoc._id });

    const token = generateToken(student._id);

    return res.json({
      message: "Login successful",
      token,
      user: student,
    });
  } catch (error) {
    console.error("verifyStudentOtp error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ====================================================================
   3) FACULTY LOGIN ➝ facultyId + password
   — If matches Admin email/password -> login as admin (no OTP)
   ==================================================================== */
const facultyLogin = async (req, res) => {
  try {
    const { facultyId, password } = req.body;

    if (!facultyId || !password)
      return res.status(400).json({ message: "facultyId and password required" });

    /* ---------------- ADMIN LOGIN BLOCK ---------------- */
    if (
      facultyId === process.env.ADMIN_ID &&
      password === process.env.ADMIN_PASSWORD
    ) {
      let admin = await User.findOne({ role: "Admin" });

      if (!admin) {
        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        admin = await User.create({
          name: "Super Admin",
          email: 'anant.7878920052@gmail.com',
          passwordHash,
          role: "Admin",
          department: "ADMIN",
        });
      }

      const token = generateToken(admin._id);
      return res.json({
        message: "Admin login successful",
        token,
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: "Admin",
        },
      });
    }

    /* ---------------- NORMAL FACULTY LOGIN ---------------- */
    const faculty = await User.findOne({ facultyId, role: "Faculty" });
    if (!faculty)
      return res.status(400).json({ message: "Invalid faculty ID or password" });

    const isMatch = await bcrypt.compare(password, faculty.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid faculty ID or password" });

    // Send OTP
    const otp = generateOtp();
    await OTP.create({ email: faculty.email, otp });

    return res.json({
      message: "OTP sent to your registered email",
      userId: faculty._id,
    });
  } catch (error) {
    console.error("facultyLogin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ====================================================================
   4) VERIFY FACULTY OTP
   ==================================================================== */
const verifyFacultyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp)
      return res.status(400).json({ message: "userId and otp required" });

    const faculty = await User.findById(userId);
    if (!faculty || faculty.role !== "Faculty")
      return res.status(400).json({ message: "Invalid faculty" });

    const latestOtpDoc = await OTP.findOne({ email: faculty.email })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestOtpDoc) return res.status(400).json({ message: "OTP expired" });
    if (latestOtpDoc.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    await OTP.deleteOne({ _id: latestOtpDoc._id });

    const token = generateToken(faculty._id);

    return res.json({
      message: "Login successful",
      token,
      user: faculty,
    });
  } catch (error) {
    console.error("verifyFacultyOtp error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ====================================================================
   5) FORGOT PASSWORD (by email) ➝ send OTP
   ==================================================================== */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    // Find user with this email (Student / Faculty / Admin)
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found with this email" });

    // Optionally: delete old OTPs for this email
    await OTP.deleteMany({ email });

    const otp = generateOtp();
    await OTP.create({ email, otp });

    // TODO: integrate your email service here
    console.log(
      `DEBUG: Password reset OTP for ${email} is ${otp} (send via email in production)`
    );

    return res.json({
      message: "OTP sent to your email for password reset",
      email,
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ====================================================================
   6) RESET PASSWORD ➝ email + otp + newPassword
   ==================================================================== */
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({
        message: "email, otp and newPassword are required",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found with this email" });

    // Get latest OTP sent to this email
    const latestOtpDoc = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestOtpDoc)
      return res.status(400).json({ message: "OTP expired or not found" });

    if (latestOtpDoc.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // Delete OTP after use
    await OTP.deleteOne({ _id: latestOtpDoc._id });

    // Hash and update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    return res.json({
      message: "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  studentLogin,
  verifyStudentOtp,
  facultyLogin,
  verifyFacultyOtp,
  forgotPassword,
  resetPassword
};
