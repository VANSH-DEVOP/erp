import React, { useState, useEffect } from "react";
import { FiBookOpen, FiUsers } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ViewCurrentCourseOfferings = () => {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState(null);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token"); // admin token

        const res = await fetch(`${API_URL}/api/admin/offerings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load offerings");
        }

        // data.offerings from backend
        setOfferings(data.offerings || []);
      } catch (err) {
        console.error("Error fetching offerings:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  const openStudentsModal = (offering) => {
    setSelectedOffering(offering);
    setShowStudentsModal(true);
  };

  const closeStudentsModal = () => {
    setSelectedOffering(null);
    setShowStudentsModal(false);
  };

  // Backend already filters to OPEN; keep this in case you add others later
  const openOfferings = offerings;

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        Current Course Offerings
      </h1>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <span className="h-10 w-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
              <FiBookOpen />
            </span>
            Open Offerings (Current Semester)
          </h2>
          <p className="text-sm text-slate-500">
            List of all open courses with option to view enrolled students.
          </p>
        </div>

        {/* Error / Loading */}
        {error && (
          <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            Loading offerings...
          </div>
        ) : (
          <div className="overflow-x-auto bg-pink-50/40 rounded-2xl border border-pink-100 p-3 sm:p-4">
            <table className="min-w-full text-left border-collapse bg-white rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-pink-50 border-b border-pink-100">
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                    #
                  </th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                    Course Code
                  </th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                    Course Name
                  </th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                    Sem
                  </th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                    Dept
                  </th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                    Instructor
                  </th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                    Enrolled
                  </th>
                  <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {openOfferings.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      No open course offerings found.
                    </td>
                  </tr>
                )}

                {openOfferings.map((offer, index) => (
                  <tr
                    key={offer.id}
                    className="border-b border-pink-50 last:border-b-0 hover:bg-pink-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-600">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-xs sm:text-sm font-mono text-slate-700">
                      {offer.courseCode}
                    </td>

                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-700">
                      {offer.courseName}
                    </td>

                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-700">
                      {offer.semester}
                    </td>

                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-700">
                      {offer.dept}
                    </td>

                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-700">
                      <div className="flex flex-col">
                        <span className="font-medium">{offer.instructor}</span>
                        <span className="text-[11px] text-slate-500">
                          ID: {offer.instructorId}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm sm:text-md text-slate-700">
                      <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-1 text-[15px] font-medium text-pink-700 border border-pink-100">
                        <FiUsers size={12} />
                        {offer.enrolledStudents?.length || 0}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs sm:text-sm text-slate-700">
                      <button
                        type="button"
                        onClick={() => openStudentsModal(offer)}
                        className="inline-flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-[11px] font-semibold text-pink-600 hover:bg-pink-100 transition shadow-sm"
                      >
                        <FiUsers size={12} />
                        View Students
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enrolled Students Modal */}
      {showStudentsModal && selectedOffering && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-lg w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              Enrolled Students
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {selectedOffering.courseCode} –{" "}
              <span className="font-semibold">
                {selectedOffering.courseName}
              </span>{" "}
              | Dept: {selectedOffering.dept} | Sem:{" "}
              {selectedOffering.semester}
            </p>

            {selectedOffering.enrolledStudents?.length === 0 ? (
              <p className="text-sm text-slate-500">
                No students enrolled in this course yet.
              </p>
            ) : (
              <div className="overflow-x-auto bg-pink-50/40 rounded-2xl border border-pink-100">
                <table className="min-w-full text-left border-collapse bg-white rounded-2xl overflow-hidden">
                  <thead>
                    <tr className="bg-pink-50 border-b border-pink-100">
                      <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                        #
                      </th>
                      <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                        Roll No
                      </th>
                      <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOffering.enrolledStudents.map((stu, idx) => (
                      <tr
                        key={stu.roll + idx}
                        className="border-b border-pink-50 last:border-b-0 hover:bg-pink-50/60 transition-colors"
                      >
                        <td className="px-4 py-2.5 text-xs sm:text-sm text-slate-600">
                          {idx + 1}
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
            )}

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={closeStudentsModal}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-pink-100 text-slate-600 hover:bg-pink-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCurrentCourseOfferings;
