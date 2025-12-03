import React, { useState, useMemo } from "react";
import {
  FiUser,
  FiMail,
  FiHome,
  FiBriefcase,
  FiEye,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

export default function ViewAllFaculty() {
  // ================= TEMP STATIC DATA (Replace with backend later) =================
  const [faculties] = useState([
    {
      id: 1,
      facultyId: "CSE01",
      name: "Dr. Meera Singh",
      email: "meera.singh@university.edu",
      department: "CSE",
      designation: "Assistant Professor",
    },
    {
      id: 2,
      facultyId: "ECE09",
      name: "Prof. Rajat Mehra",
      email: "rajat.mehra@university.edu",
      department: "ECE",
      designation: "Associate Professor",
    },
    {
      id: 3,
      facultyId: "IT04",
      name: "Dr. Riya Kapoor",
      email: "riya.kapoor@university.edu",
      department: "IT",
      designation: "Professor",
    },
  ]);

  const departments = ["CSE", "ECE", "IT", "MECH", "CIVIL"];
  const designations = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
  ];

  // ================= FILTER STATES =================
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDesig, setSelectedDesig] = useState("");

  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // ================= FILTERED DATA LOGIC =================
  const filteredFaculties = useMemo(() => {
    return faculties.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.facultyId.toLowerCase().includes(search.toLowerCase()) ||
        f.email.toLowerCase().includes(search.toLowerCase());

      const matchDept = selectedDept ? f.department === selectedDept : true;
      const matchDesig = selectedDesig ? f.designation === selectedDesig : true;

      return matchSearch && matchDept && matchDesig;
    });
  }, [search, selectedDept, selectedDesig, faculties]);

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">

      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-8">
        View All Faculty
      </h1>

      {/* Filters Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-md border border-purple-100 p-6 mb-8">

        <div className="flex items-center gap-3 text-purple-600 font-semibold mb-4">
          <FiFilter /> Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute top-3 left-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, faculty ID, email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-300 outline-none"
            />
          </div>

          {/* Department Filter */}
          <select
            className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-300 outline-none"
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

          {/* Designation Filter */}
          <select
            className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-300 outline-none"
            value={selectedDesig}
            onChange={(e) => setSelectedDesig(e.target.value)}
          >
            <option value="">All Designations</option>
            {designations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-purple-100 p-6">

        <h2 className="text-2xl font-bold text-slate-700 mb-6">Faculty Records</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50 border-b border-purple-100">
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">#</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Faculty ID</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Department</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Designation</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">View</th>
              </tr>
            </thead>

            <tbody>
              {filteredFaculties.map((f, index) => (
                <tr
                  key={f.id}
                  className="border-b border-purple-50 hover:bg-purple-50/50 transition"
                >
                  <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">{f.facultyId}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{f.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{f.department}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{f.designation}</td>

                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setSelectedFaculty(f)}
                      className="p-1.5 rounded-full border border-purple-200 text-purple-600 hover:bg-purple-100 shadow-sm transition"
                    >
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredFaculties.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">
                    No faculty match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 max-w-md w-full mx-4 p-6">

            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="h-10 w-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center">
                <FiUser />
              </span>
              Faculty Details
            </h3>

            <div className="space-y-2 text-sm text-slate-700 mb-6">
              <p><strong>Faculty ID:</strong> {selectedFaculty.facultyId}</p>
              <p><strong>Name:</strong> {selectedFaculty.name}</p>

              <p className="flex items-center gap-2">
                <FiMail className="text-purple-500" />
                <span><strong>Email:</strong> {selectedFaculty.email}</span>
              </p>

              <p className="flex items-center gap-2">
                <FiHome className="text-purple-500" />
                <span><strong>Department:</strong> {selectedFaculty.department}</span>
              </p>

              <p className="flex items-center gap-2">
                <FiBriefcase className="text-purple-500" />
                <span><strong>Designation:</strong> {selectedFaculty.designation}</span>
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-purple-100 text-slate-600 hover:bg-purple-50 transition"
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
