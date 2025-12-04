import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiBookOpen,
  FiPhone,
  FiCalendar,
  FiCheckSquare,
  FiLayers,
  FiHome,
  FiTag,
} from "react-icons/fi";

const FacultyProfile = () => {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 👉 Fetch current logged-in faculty: GET /api/faculty/me
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token"); // adjust key if different

        const res = await fetch("http://localhost:5000/api/faculty/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to fetch faculty details");
        }

        const data = await res.json();
        setFaculty(data.faculty);
      } catch (err) {
        console.error("Error fetching faculty details:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const actions = [
    {
      title: "Approve Enrollment Requests",
      icon: <FiCheckSquare size={26} />,
      path: "/faculty/approve-enrollment",
    },
    {
      title: "View Current Courses",
      icon: <FiLayers size={26} />,
      path: "/faculty/current-courses",
    },
  ];

  // Safely derive joined year if present
  const joinedYear = faculty?.joined
    ? new Date(faculty.joined).getFullYear()
    : faculty?.joinedOn
    ? new Date(faculty.joinedOn).getFullYear()
    : "";

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      <h1 className="text-4xl font-extrabold text-slate-700 text-center mb-10">
        Faculty Profile
      </h1>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-10">
        {/* Loading / Error states */}
        {loading && (
          <p className="text-center text-slate-500 mb-4">Loading profile...</p>
        )}
        {error && (
          <p className="text-center text-red-500 mb-4">
            {error}
          </p>
        )}

        {faculty && (
          <>
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8">
              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow">
                <FiUser size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-700">
                  {faculty.name || faculty.fullName || "Unnamed Faculty"}
                </h2>
                <p className="text-slate-500">
                  {faculty.department
                    ? `${faculty.department} Department`
                    : "Department not set"}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-700">
              <div className="flex items-center gap-3">
                <FiMail className="text-pink-500" size={22} />
                <p>
                  <strong>Email:</strong> {faculty.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiPhone className="text-pink-500" size={22} />
                <p>
                  <strong>Phone:</strong>{" "}
                  {faculty.phone || faculty.phoneNumber || "Not provided"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiBookOpen className="text-pink-500" size={22} />
                <p>
                  <strong>Faculty ID:</strong>{" "}
                  {faculty.facultyId || faculty.employeeId || faculty._id}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiTag className="text-pink-500" size={22} />
                <p>
                  <strong>Designation:</strong>{" "}
                  {faculty.designation || "Not set"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiCalendar className="text-pink-500" size={22} />
                <p>
                  <strong>Joined (Year):</strong>{" "}
                  {joinedYear || "Not available"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FiHome className="text-pink-500" size={22} />
                <p>
                  <strong>Address:</strong>{" "}
                  {faculty.address || "Not provided"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <h3 className="text-xl font-semibold text-slate-600 mt-10 mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {actions.map((action, i) => (
                <div
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="bg-white rounded-2xl p-4 border border-pink-100 shadow hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-4"
                >
                  <div className="h-14 w-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center shadow">
                    {action.icon}
                  </div>
                  <p className="text-slate-700 font-semibold">
                    {action.title}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && !error && !faculty && (
          <p className="text-center text-slate-500">
            No faculty data found.
          </p>
        )}
      </div>
    </div>
  );
};

export default FacultyProfile;
