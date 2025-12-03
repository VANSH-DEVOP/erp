import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiTrash2, FiBookOpen } from "react-icons/fi";

// 💡 Departments
const DEPARTMENTS = ["CSE", "ECE", "MECH", "CIVIL", "IT"];

// 💡 Semesters
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // ===================== FETCH ALL COURSES =====================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token"); // adjust if stored differently

        const res = await axios.get(`${API_BASE_URL}/admin/courses`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        setCourses(res.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(
          err.response?.data?.message || "Failed to load courses. Try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ===================== ADD COURSE (API) =====================
  const handleAddCourse = async () => {
    if (
      !newCourse.courseCode ||
      !newCourse.courseName ||
      !newCourse.department ||
      !newCourse.semester
    )
      return;

    try {
      const token = localStorage.getItem("token");

      const payload = {
        courseCode: newCourse.courseCode.toUpperCase(),
        courseName: newCourse.courseName,
        department: newCourse.department,
        semester: Number(newCourse.semester),
      };

      const res = await axios.post(
        `${API_BASE_URL}/admin/add-course`,
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      const created = res.data?.course || payload;

      // merge in case backend doesn’t yet store dept/sem
      setCourses((prev) => [
        ...prev,
        {
          ...created,
          department: created.department || payload.department,
          semester: created.semester || payload.semester,
        },
      ]);

      setNewCourse({
        courseCode: "",
        courseName: "",
        department: "",
        semester: "",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.response?.data?.message || "Failed to add course.");
    }
  };

  // ===================== DELETE COURSE (API) =====================
  const handleDropCourse = async () => {
    if (!selectedCourse) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_BASE_URL}/admin/course/${selectedCourse._id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setCourses((prev) => prev.filter((c) => c._id !== selectedCourse._id));
      setShowDeleteModal(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error("Error deleting course:", err);
      setError(err.response?.data?.message || "Failed to delete course.");
    }
  };

  // ===================== FILTER LOGIC =====================
  const filteredCourses = courses.filter((c) => {
    const code = (c.courseCode || "").toLowerCase();
    const name = (c.courseName || "").toLowerCase();
    const matchSearch =
      code.includes(searchTerm.toLowerCase()) ||
      name.includes(searchTerm.toLowerCase());

    const matchDept = deptFilter ? c.department === deptFilter : true;
    const matchSem = semesterFilter
      ? Number(c.semester) === Number(semesterFilter)
      : true;

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

        {loading && (
          <p className="text-sm text-pink-500 mb-3 animate-pulse">
            Loading courses...
          </p>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

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
              {!loading && filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-500">
                    No matching courses found.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course, index) => (
                  <tr
                    key={course._id || index}
                    className="border-b border-pink-50 hover:bg-pink-50/50 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-mono">
                      {course.courseCode || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {course.courseName || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {course.department || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {course.semester || "-"}
                    </td>

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
            <h3 className="text-xl font-bold text-slate-700 mb-4">
              Add New Course
            </h3>

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
                onClick={handleAddCourse}
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
            <h3 className="text-xl font-bold text-slate-700 mb-4">
              Confirm Delete
            </h3>

            <p className="text-slate-600 mb-6">
              Delete{" "}
              <span className="font-semibold">
                {selectedCourse.courseName}
              </span>{" "}
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
                onClick={handleDropCourse}
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
