import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiHome,
  FiCalendar,
  FiBookOpen,
  FiEye,
  FiSearch,
  FiFilter,
  FiArrowLeft
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function ViewAllStudents() {
  // ================= BACKEND DATA =================
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================== FILTER STATES ==================
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const departments = ["CSE", "ECE", "IT", "MECH", "CIVIL"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  // ================= FETCH STUDENTS =================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token"); // adjust if you store it differently

        const res = await axios.get(`${API_BASE_URL}/admin/students`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        setStudents(res.data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(
          err.response?.data?.message || "Failed to load students. Try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // ================== FILTERED DATA LOGIC ==================
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const name = (stu.name || "").toLowerCase();
      const rollNo = (stu.rollNo || "").toLowerCase();
      const email = (stu.email || "").toLowerCase();

      const searchLower = search.toLowerCase();

      const matchSearch =
        name.includes(searchLower) ||
        rollNo.includes(searchLower) ||
        email.includes(searchLower);

      const matchDept = selectedDept ? stu.department === selectedDept : true;
      const matchSem = selectedSem
        ? Number(stu.currentSemester) === Number(selectedSem)
        : true;

      return matchSearch && matchDept && matchSem;
    });
  }, [search, selectedDept, selectedSem, students]);

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      {/* Title */}
      
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-8">
        View All Students
      </h1>

      {/* Filters Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-md border border-blue-100 p-6 mb-8">
      <div className="max-w-6xl mx-auto mb-5">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold 
                border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              >
                <FiArrowLeft /> Back to Dashboard
              </button>
            </div>
        <div className="flex items-center gap-3 text-blue-600 font-semibold mb-4">
          <FiFilter /> Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute top-3 left-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, roll, email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>

          {/* Department Filter */}
          <select
            className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-300 outline-none"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-300 outline-none"
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
          >
            <option value="">All Semesters</option>
            {semesters.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-700">Student Records</h2>

          {loading && (
            <span className="text-sm text-blue-500 animate-pulse">
              Loading students...
            </span>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-blue-100">
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">#</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Roll No
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Department
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Batch
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Semester
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  View
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((stu, index) => (
                <tr
                  key={stu._id || index}
                  className="border-b border-blue-50 hover:bg-blue-50/50 transition"
                >
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">
                    {stu.rollNo || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {stu.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {stu.department || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {stu.batch || stu.batchYear || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {stu.currentSemester || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setSelectedStudent(stu)}
                      className="p-1.5 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-100 shadow-sm transition"
                    >
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500">
                    No students match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Student Info */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="h-10 w-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                <FiUser />
              </span>
              Student Details
            </h3>

            <div className="space-y-2 text-sm text-slate-700 mb-6">
              <p>
                <strong>Roll No:</strong> {selectedStudent.rollNo || "-"}
              </p>
              <p>
                <strong>Name:</strong> {selectedStudent.name || "-"}
              </p>

              <p className="flex items-center gap-2">
                <FiMail className="text-blue-500" />
                <span>
                  <strong>Email:</strong> {selectedStudent.email || "-"}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <FiHome className="text-blue-500" />
                <span>
                  <strong>Department:</strong>{" "}
                  {selectedStudent.department || "-"}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <FiCalendar className="text-blue-500" />
                <span>
                  <strong>Batch:</strong>{" "}
                  {selectedStudent.batch || selectedStudent.batchYear || "-"}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <FiBookOpen className="text-blue-500" />
                <span>
                  <strong>Semester:</strong>{" "}
                  {selectedStudent.currentSemester || "-"}
                </span>
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-blue-100 text-slate-600 hover:bg-blue-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
