import React, { useState } from "react";
import { FiBookOpen, FiUser, FiHash, FiLayers } from "react-icons/fi";

const Registration = () => {
  // TEMPORARY STATIC DATA — replace with backend later
  const [courses, setCourses] = useState([
    {
      id: 1,
      courseCode: "CS101",
      courseName: "Data Structures",
      department: "CSE",
      semester: "3",
      instructorId: "FAC1001",
      instructorName: "Dr. Kavita Sharma",
      registered: false,
    },
    {
      id: 2,
      courseCode: "CS105",
      courseName: "Operating Systems",
      department: "CSE",
      semester: "4",
      instructorId: "FAC1005",
      instructorName: "Prof. Raghav Verma",
      registered: false,
    },
    {
      id: 3,
      courseCode: "IT110",
      courseName: "Computer Networks",
      department: "IT",
      semester: "5",
      instructorId: "FAC1010",
      instructorName: "Dr. Neha Saxena",
      registered: false,
    },
  ]);

  const handleRegister = (id) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, registered: true } : course
      )
    );
    // later: call backend API here
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        Course Registration
      </h1>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-700">
            Available Course Offerings
          </h2>
          <p className="text-sm text-slate-500">
            Select a course and click register
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 border-b border-pink-100">
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  #
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Course
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Course Code
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Dept
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Semester
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Instructor
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course.id}
                  className="border-b border-pink-50 hover:bg-pink-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {index + 1}
                  </td>

                  {/* Course Name */}
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <FiBookOpen className="text-pink-500" />
                      <span className="font-semibold">
                        {course.courseName}
                      </span>
                    </div>
                  </td>

                  {/* Course Code */}
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">
                    <div className="flex items-center gap-1">
                      <FiHash className="text-pink-500" />
                      <span>{course.courseCode}</span>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {course.department}
                  </td>

                  {/* Semester */}
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="flex items-center gap-1">
                      <FiLayers className="text-pink-500" />
                      <span>{course.semester}</span>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">
                        ID:{" "}
                        <span className="font-mono">
                          {course.instructorId}
                        </span>
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-8 w-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shadow">
                          <FiUser size={15} />
                        </div>
                        <span className="font-medium">
                          {course.instructorName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Register button */}
                  <td className="px-4 py-3 text-sm">
                    <button
                      disabled={course.registered}
                      onClick={() => handleRegister(course.id)}
                      className={`
                        px-4 py-2 rounded-full text-xs font-semibold shadow-sm border transition
                        ${
                          course.registered
                            ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-pink-500 text-white border-pink-500 hover:bg-pink-600"
                        }
                      `}
                    >
                      {course.registered ? "Registered" : "Register"}
                    </button>
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-slate-500 text-sm"
                  >
                    No course offerings available right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Registration;

