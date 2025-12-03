const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Common for all
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    department: { type: String ,required: true},                                  // eg. CSE, ME, CE
    // Role: Admin | Student | Faculty
    role: {
      type: String,
      enum: ["Admin", "Student", "Faculty"],
      required: true,
    },

    // ========== Student Fields (Used only if role = Student) ==========
    rollNo: { type: String, unique: true, sparse: true },          // eg. 21CS1001
    batch: { type: Number },                                       // eg. 2023 batch
    currentSemester: { type: Number, min: 1, max: 8 },              // 1 to 8 (or 1 to 6)

    // ========== Faculty Fields (Used only if role = Faculty) ==========
    facultyId: { type: String, unique: true, sparse: true },       // eg. CS010
    designation: { type: String },                                 // eg. Assistant Professor
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);