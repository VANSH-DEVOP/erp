import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // The student who is enrolled (User with role = "Student")
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The offering in which the student is enrolled
    offering: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offering",
      required: true,
    },

    // Duplicate for faster queries (also available from offering)
    // semester: {
    //   type: String,
    //   required: true,           // e.g. "2025-ODD" / "2025-EVEN"
    //   trim: true,
    // },

    // Marks given by faculty
    // marks: {
    //   internal: { type: Number, default: 0 }, // assignments, quizzes, etc.
    //   mid: { type: Number, default: 0 },
    //   end: { type: Number, default: 0 },
    //   total: { type: Number, default: 0 },
    // },

    // Final grade for the course
    // grade: {
    //   type: String,
    //   default: "",              // e.g. "A", "B", "C", "F"
    //   trim: true,
    // },

    // Status of this enrollment
    // status: {
    //   type: String,
    //   enum: ["ONGOING", "PASSED", "FAILED"],
    //   default: "ONGOING",
    // },
    
    requestStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",            // when student clicks "register"
    },
  },
  { timestamps: true }
);

// A student can be enrolled only once in a particular offering
enrollmentSchema.index({ student: 1, offering: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
