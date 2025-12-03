import React, { useState, useMemo } from "react";
import {
  FiUser,
  FiMail,
  FiHome,
  FiCalendar,
  FiBookOpen,
  FiEye,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

export default function ViewAllStudents() {
  // ================= TEMP STATIC DATA (Replace later with backend) =================
  const [students] = useState([
    {
      id: 1,
      rollNo: "23CSE001",
      name: "Arjun Sharma",
      email: "arjun.sharma@university.edu",
      department: "CSE",
      batch: 2023,
      currentSemester: 4,
    },
    {
      id: 2,
      rollNo: "23ECE014",
      name: "Nisha Verma",
      email: "nisha.verma@university.edu",
      department: "ECE",
      batch: 2023,
      currentSemester: 4,
    },
    {
      id: 3,
      rollNo: "22IT008",
      name: "Ravi Mehta",
      email: "ravi.mehta@university.edu",
      department: "IT",
      batch: 2022,
      currentSemester: 6,
    },
  ]);

  const departments = ["CSE", "ECE", "IT", "MECH", "CIVIL"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  // ================== FILTER STATES ==================
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  // ================== FILTERED DATA LOGIC ==================
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const matchSearch =
        stu.name.toLowerCase().includes(search.toLowerCase()) ||
        stu.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        stu.email.toLowerCase().includes(search.toLowerCase());

      const matchDept = selectedDept ? stu.department === selectedDept : true;
      const matchSem = selectedSem ? stu.currentSemester === Number(selectedSem) : true;

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

        <h2 className="text-2xl font-bold text-slate-700 mb-6">Student Records</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-blue-100">
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">#</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Roll No</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Department</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Batch</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Semester</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">View</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((stu, index) => (
                <tr
                  key={stu.id}
                  className="border-b border-blue-50 hover:bg-blue-50/50 transition"
                >
                  <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">{stu.rollNo}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{stu.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{stu.department}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{stu.batch}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{stu.currentSemester}</td>
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

              {filteredStudents.length === 0 && (
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
              <p><strong>Roll No:</strong> {selectedStudent.rollNo}</p>
              <p><strong>Name:</strong> {selectedStudent.name}</p>

              <p className="flex items-center gap-2">
                <FiMail className="text-blue-500" />
                <span><strong>Email:</strong> {selectedStudent.email}</span>
              </p>

              <p className="flex items-center gap-2">
                <FiHome className="text-blue-500" />
                <span><strong>Department:</strong> {selectedStudent.department}</span>
              </p>

              <p className="flex items-center gap-2">
                <FiCalendar className="text-blue-500" />
                <span><strong>Batch:</strong> {selectedStudent.batch}</span>
              </p>

              <p className="flex items-center gap-2">
                <FiBookOpen className="text-blue-500" />
                <span><strong>Semester:</strong> {selectedStudent.currentSemester}</span>
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
