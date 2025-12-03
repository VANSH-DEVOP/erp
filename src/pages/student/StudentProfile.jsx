import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiBookOpen,
  FiCalendar,
  FiHash,
  FiCheckSquare,
  FiLayers,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StudentProfile = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const actions = [
    {
      title: "Course Registration",
      icon: <FiCheckSquare size={26} />,
      path: "/student/registration",
    },
    {
      title: "My Current Courses",
      icon: <FiLayers size={26} />,
      path: "/student/current-courses",
    },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token"); // adjust if needed

        const res = await fetch(`${API_URL}/api/student/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load student profile");
        }

        setStudent(data.student);
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Safely derive some values
  const joinedYear = student?.createdAt
    ? new Date(student.createdAt).getFullYear()
    : student?.batch || "—";

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-slate-700 text-center mb-10">
        Student Profile
      </h1>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-10">
        {/* Error */}
        {error && (
          <div className="mb-6 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            Loading profile...
          </div>
        ) : !student ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            Profile not found.
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8">
              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow">
                <FiUser size={40} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-700">
                  {student.name}
                </h2>
                <p className="text-slate-500">
                  {student.department || "Department not set"}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-700">
              <div className="flex items-center gap-3">
                <FiMail size={22} className="text-pink-500" />
                <p>
                  <strong>Email:</strong> {student.email || "—"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiPhone size={22} className="text-pink-500" />
                <p>
                  <strong>Phone:</strong> {student.phone || "Not provided"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiHome size={22} className="text-pink-500" />
                <p>
                  <strong>Address:</strong> {student.address || "Not provided"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiBookOpen size={22} className="text-pink-500" />
                <p>
                  <strong>Roll No:</strong> {student.rollNo || "—"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiHash size={22} className="text-pink-500" />
                <p>
                  <strong>Department:</strong> {student.department || "—"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiCalendar size={22} className="text-pink-500" />
                <p>
                  <strong>Joined (Year):</strong> {joinedYear}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiLayers size={22} className="text-pink-500" />
                <p>
                  <strong>Current Semester:</strong>{" "}
                  {student.currentSemester || "—"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiCheckSquare size={22} className="text-pink-500" />
                <p>
                  <strong>Batch:</strong> {student.batch || "—"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <h3 className="text-xl font-semibold text-slate-600 mt-10 mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {actions.map((action, i) => (
                <div
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="
                    bg-white rounded-2xl p-4
                    border border-pink-100
                    shadow hover:shadow-xl hover:-translate-y-1
                    transition-all cursor-pointer flex items-center gap-4
                  "
                >
                  <div className="h-14 w-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center shadow">
                    {action.icon}
                  </div>

                  <p className="text-slate-700 font-semibold">{action.title}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
