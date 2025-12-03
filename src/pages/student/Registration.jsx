import React, { useEffect, useState } from "react";
import { FiBookOpen, FiUser, FiHash, FiLayers } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Registration = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load current offerings for student's dept + semester
  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        const token = localStorage.getItem("token"); // adjust if different

        const res = await fetch(`${API_URL}/api/student/current-offerings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load course offerings");
        }

        // data.offerings: [{ _id, courseCode, courseName, semester, department, maxSeats, status }]
        const formatted = (data.offerings || []).map((off) => ({
          ...off,
          registered: false, // local UI state for button
        }));

        setCourses(formatted);
      } catch (err) {
        console.error("Error fetching offerings:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  const handleRegister = async (offeringId) => {
    try {
      setActionLoadingId(offeringId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/student/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ offeringId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Mark this course as "registered" in UI
      setCourses((prev) =>
        prev.map((course) =>
          course._id === offeringId ? { ...course, registered: true } : course
        )
      );

      setSuccessMessage(
        data.message ||
          "Enrollment request submitted. Waiting for faculty approval."
      );
    } catch (err) {
      console.error("Error registering in offering:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setActionLoadingId(null);
    }
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

        {/* Messages */}
        {error && (
          <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            Loading available course offerings...
          </div>
        ) : (
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
                    Max Seats
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course, index) => (
                  <tr
                    key={course._id}
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

                    {/* Max Seats */}
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {course.maxSeats}
                    </td>

                    {/* Register button */}
                    <td className="px-4 py-3 text-sm">
                      <button
                        disabled={course.registered || actionLoadingId === course._id}
                        onClick={() => handleRegister(course._id)}
                        className={`
                          px-4 py-2 rounded-full text-xs font-semibold shadow-sm border transition
                          ${
                            course.registered
                              ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                              : "bg-pink-500 text-white border-pink-500 hover:bg-pink-600"
                          }
                          ${actionLoadingId === course._id ? "opacity-70 cursor-wait" : ""}
                        `}
                      >
                        {course.registered
                          ? "Request Sent"
                          : actionLoadingId === course._id
                          ? "Registering..."
                          : "Register"}
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && courses.length === 0 && (
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
        )}
      </div>
    </div>
  );
};

export default Registration;
