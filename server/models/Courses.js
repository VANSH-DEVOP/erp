const mongoose = require("mongoose"); 

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,               // Example: CS101
      uppercase: true,
      trim: true,
    },

    courseName: {
      type: String,
      required: true,            // Example: Data Structures
      trim: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
