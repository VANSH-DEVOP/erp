import React from "react";
import { FiBookOpen, FiUser, FiLayers } from "react-icons/fi";

const StudentCurrentCourses = () => {
  // TEMPORARY STATIC DATA — replace with backend later
  const enrolledCourses = [
    {
      courseCode: "CS101",
      courseName: "Data Structures",
      instructor: "Dr. Kavita Sharma",
    },
    {
      courseCode: "CS105",
      courseName: "Operating Systems",
      instructor: "Prof. Raghav Verma",
    },
    {
      courseCode: "CS110",
      courseName: "Database Management Systems",
      instructor: "Dr. Neha Saxena",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        Your Current Courses
      </h1>

      {/* Course Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-7">
        {enrolledCourses.map((course, index) => (
          <div
            key={index}
            className="bg-white border border-pink-100 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all p-7 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-pink-100 text-pink-500 shadow flex items-center justify-center">
                <FiBookOpen size={26} />
              </div>
              <h2 className="text-2xl font-bold text-slate-700 leading-tight">
                {course.courseName}
              </h2>
            </div>

            {/* Course Meta */}
            <p className="text-slate-500 font-mono text-sm bg-pink-50 px-3 py-1 inline-block rounded-lg border border-pink-200 mb-5">
              <strong>Course Code:</strong> {course.courseCode}
            </p>

            {/* Instructor */}
            <div className="flex items-center justify-between bg-pink-50/50 border border-pink-100 rounded-2xl px-4 py-3 mt-auto">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-500 shadow flex items-center justify-center">
                  <FiUser size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 leading-tight">Instructor</p>
                  <p className="font-semibold text-slate-700">{course.instructor}</p>
                </div>
              </div>

              <FiLayers size={22} className="text-pink-400 opacity-60" />
            </div>
          </div>
        ))}

        {enrolledCourses.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-6 col-span-full">
            You are not enrolled in any course currently.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentCurrentCourses;
