import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiBookOpen } from "react-icons/fi";

// 💡 Departments
const DEPARTMENTS = ["CSE", "ECE", "MECH", "CIVIL", "IT"];

// 💡 Semesters
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function AllCourses() {
  // ===================== TEMP STATIC DATA =====================
  const demoCourses = [
    {
      _id: "1",
      courseCode: "CS101",
      courseName: "Introduction to Programming",
      department: "CSE",
      semester: 1,
    },
    {
      _id: "2",
      courseCode: "CS102",
      courseName: "Data Structures",
      department: "CSE",
      semester: 2,
    },
    {
      _id: "3",
      courseCode: "CS201",
      courseName: "Operating Systems",
      department: "CSE",
      semester: 3,
    },
    {
      _id: "4",
      courseCode: "IT110",
      courseName: "Computer Networks",
      department: "IT",
      semester: 3,
    },
    {
      _id: "5",
      courseCode: "MA101",
      courseName: "Engineering Mathematics",
      department: "CIVIL",
      semester: 1,
    },
    {
      _id: "6",
      courseCode: "EC205",
      courseName: "Digital Electronics",
      department: "ECE",
      semester: 2,
    },
  ];

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  // Add Course Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    courseName: "",
    department: "",
    semester: "",
  });

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Load temp data
  useEffect(() => {
    setTimeout(() => {
      setCourses(demoCourses);
      setLoading(false);
    }, 300);
  }, []);

  // ===================== ADD COURSE =====================
  const addCourse = () => {
    if (
      !newCourse.courseCode ||
      !newCourse.courseName ||
      !newCourse.department ||
      !newCourse.semester
    )
      return;

    const course = {
      _id: Date.now().toString(),
      courseCode: newCourse.courseCode.toUpperCase(),
      courseName: newCourse.courseName,
      department: newCourse.department,
      semester: Number(newCourse.semester),
    };

    setCourses((prev) => [...prev, course]);

    setNewCourse({
      courseCode: "",
      courseName: "",
      department: "",
      semester: "",
    });

    setShowAddModal(false);
  };

  // ===================== DELETE COURSE =====================
  const dropCourse = () => {
    setCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
    setShowDeleteModal(false);
  };

  // ===================== FILTER LOGIC =====================
  const filteredCourses = courses.filter((c) => {
    const matchSearch =
      c.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDept = deptFilter ? c.department === deptFilter : true;
    const matchSem = semesterFilter ? c.semester === Number(semesterFilter) : true;

    return matchSearch && matchDept && matchSem;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">

      {/* PAGE TITLE */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        All Courses
      </h1>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <FiBookOpen className="text-pink-500" /> Course List
          </h2>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-pink-400 text-white px-4 py-2 rounded-full shadow hover:bg-pink-500 transition"
          >
            <FiPlus /> Add Course
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search Code or Name"
            className="px-4 py-3 rounded-xl border border-slate-200 w-full sm:w-1/3 focus:ring-2 focus:ring-pink-300 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Department Filter */}
          <select
            className="px-4 py-3 rounded-xl border border-slate-200 w-full sm:w-1/4 focus:ring-2 focus:ring-pink-300 outline-none"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            className="px-4 py-3 rounded-xl border border-slate-200 w-full sm:w-1/4 focus:ring-2 focus:ring-pink-300 outline-none"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="">All Semesters</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-pink-50 border-b border-pink-100 text-slate-700">
                <th className="px-4 py-3 font-semibold text-left">#</th>
                <th className="px-4 py-3 font-semibold text-left">Code</th>
                <th className="px-4 py-3 font-semibold text-left">Course Name</th>
                <th className="px-4 py-3 font-semibold text-left">Department</th>
                <th className="px-4 py-3 font-semibold text-left">Semester</th>
                <th className="px-4 py-3 font-semibold text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-500">
                    No matching courses found.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course, index) => (
                  <tr
                    key={course._id}
                    className="border-b border-pink-50 hover:bg-pink-50/50 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-mono">{course.courseCode}</td>
                    <td className="px-4 py-3">{course.courseName}</td>
                    <td className="px-4 py-3">{course.department}</td>
                    <td className="px-4 py-3">{course.semester}</td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD COURSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-6 max-w-md w-full mx-4">
            
            <h3 className="text-xl font-bold text-slate-700 mb-4">Add New Course</h3>

            <input
              type="text"
              placeholder="Course Code"
              className="w-full px-4 py-3 mb-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-300 outline-none"
              value={newCourse.courseCode}
              onChange={(e) =>
                setNewCourse({ ...newCourse, courseCode: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Course Name"
              className="w-full px-4 py-3 mb-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-300 outline-none"
              value={newCourse.courseName}
              onChange={(e) =>
                setNewCourse({ ...newCourse, courseName: e.target.value })
              }
            />

            <select
              className="w-full px-4 py-3 mb-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-300 outline-none"
              value={newCourse.department}
              onChange={(e) =>
                setNewCourse({ ...newCourse, department: e.target.value })
              }
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-300 outline-none"
              value={newCourse.semester}
              onChange={(e) =>
                setNewCourse({ ...newCourse, semester: e.target.value })
              }
            >
              <option value="">Select Semester</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-full border text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={addCourse}
                className="px-4 py-2 rounded-full bg-pink-500 text-white shadow hover:bg-pink-600 transition"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl border border-rose-100 p-6 max-w-md w-full mx-4">
            
            <h3 className="text-xl font-bold text-slate-700 mb-4">Confirm Delete</h3>

            <p className="text-slate-600 mb-6">
              Delete <span className="font-semibold">{selectedCourse.courseName}</span>{" "}
              ({selectedCourse.courseCode})?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full border text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={dropCourse}
                className="px-4 py-2 rounded-full bg-rose-500 text-white shadow hover:bg-rose-600 transition"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
