const mongoose = require("mongoose");

const offeringSchema = new mongoose.Schema(
  {
    // Reference of the course (from Course collection)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",               // User with role = "Faculty"
      required: true,
    },

    // Semester of the offering — e.g. "2025-ODD" or "2025-EVEN"
    semester: {
      type: Number,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,     // e.g., CSE / ECE / ME
      uppercase: true,
      trim: true,
    },

    maxSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
    
  },
  { timestamps: true }
);

// Prevent admin from creating duplicate offerings of same course+semester+section
offeringSchema.index(
  { course: 1, semester: 1, department: 1 },
  { unique: true }
);

module.exports = mongoose.model("Offering", offeringSchema);
