import React, { useState } from "react";
import { FiBookOpen, FiUsers } from "react-icons/fi";

const FacultyCurrentCourses = () => {
  // DATA — replace later with backend response
  const courses = [
    {
      id: "CS101",
      code: "CS101",
      name: "Programming",
      semester: 1,
      dept: "CSE",
      section: "A",
      students: [
        { roll: "21CS001", name: "Anuj Sharma" },
        { roll: "21CS002", name: "Priya Verma" },
      ],
    },
    {
      id: "CSE201",
      code: "CSE201",
      name: "Data Structures",
      semester: 3,
      dept: "CSE",
      section: "B",
      students: [
        { roll: "21CS010", name: "Rohit Singh" },
        { roll: "21CS011", name: "Simran Kaur" },
        { roll: "21CS012", name: "Kunal Mehta" },
      ],
    },
  ];

  // Default select first course
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        Courses You Teach
      </h1>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        <div className="grid md:grid-cols-[1fr,1.55fr] gap-6">
          
          {/* LEFT — Course List */}
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="h-9 w-9 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                <FiBookOpen />
              </span>
              Course List
            </h2>

            <ul className="space-y-3">
              {courses.map((course) => (
                <li
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`px-4 py-3 rounded-2xl border transition shadow-sm cursor-pointer
                    ${
                      selectedCourse.id === course.id
                        ? "bg-pink-50 border-pink-300"
                        : "bg-white border-pink-100 hover:bg-pink-50/60"
                    }`}
                >
                  <div className="font-semibold text-sm text-slate-800">
                    {course.code} – {course.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Dept: <b>{course.dept}</b> • Sem: <b>{course.semester}</b> • Sec: <b>{course.section}</b>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-medium">
                    <FiUsers size={14} /> {course.students.length} Students
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — Course Details */}
          <div className="bg-pink-50/40 border border-pink-100 rounded-2xl p-4 sm:p-5 overflow-x-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                {selectedCourse.code} – {selectedCourse.name}
              </h3>
              <span className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="h-9 w-9 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                  <FiUsers />
                </span>
                {selectedCourse.students.length} students
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Department: <b>{selectedCourse.dept}</b> • Semester:{" "}
              <b>{selectedCourse.semester}</b> • Section:{" "}
              <b>{selectedCourse.section}</b>
            </p>

            <h4 className="text-sm font-semibold text-slate-700 mb-2">
              Enrolled Students
            </h4>

            <div className="overflow-x-auto bg-white rounded-xl border border-pink-100 shadow-sm">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-pink-50 border-b border-pink-100">
                    <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                      #
                    </th>
                    <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                      Roll No
                    </th>
                    <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                      Student Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCourse.students.map((stu, index) => (
                    <tr
                      key={stu.roll}
                      className="border-b border-pink-50 last:border-b-0 hover:bg-pink-50/50 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-xs sm:text-sm text-slate-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-700">
                        {stu.roll}
                      </td>
                      <td className="px-4 py-2.5 text-xs sm:text-sm text-slate-700">
                        {stu.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FacultyCurrentCourses;
