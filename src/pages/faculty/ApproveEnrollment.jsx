import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FiEye,
  FiCheck,
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
  FiBookOpen,
} from "react-icons/fi";

// Change this if you have a global API_URL somewhere
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ApproveEnrollment = ({ courseId: propCourseId }) => {
  const params = useParams();
  const courseId = propCourseId || params.courseId; // supports both prop and route param

  const [enrollments, setEnrollments] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null); // { type, enrollment }
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch pending enrollment requests for this course
  useEffect(() => {
    if (!courseId) return;

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token"); // adjust if you store auth differently

        const res = await fetch(
          `${API_URL}/api/faculty/requests/course`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load enrollment requests");
        }

        // data.enrollments comes from your backend
        setEnrollments(data.enrollments || []);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [courseId]);

  const openActionModal = (type, enrollment) => {
    setSelectedAction({ type, enrollment });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAction(null);
  };

  const handleConfirm = async () => {
    if (!selectedAction) return;
    const { type, enrollment } = selectedAction;

    if (type !== "approve" && type !== "reject") {
      closeModal();
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const endpoint =
        type === "approve"
          ? `${API_URL}/api/faculty/requests/approve`
          : `${API_URL}/api/faculty/requests/reject`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ enrollmentId: enrollment._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Action failed");
      }

      // Remove this enrollment from the list (it is no longer PENDING)
      setEnrollments((prev) =>
        prev.filter((item) => item._id !== enrollment._id)
      );

      closeModal();
    } catch (err) {
      console.error("Error approving/rejecting:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        Approve Enrollment Requests
      </h1>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-700">All Students</h2>
            <p className="text-sm text-slate-500">
              List of students requesting enrollment
            </p>
          </div>

          {courseId && (
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
              Course ID: {courseId}
            </span>
          )}
        </div>

        {/* Error / info messages */}
        {error && (
          <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            Loading enrollment requests...
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
                    Student Roll No
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Course Code
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Course Name
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment, index) => {
                  const student = enrollment.student || {};
                  const course = enrollment.offering?.course || {};

                  return (
                    <tr
                      key={enrollment._id}
                      className="border-b border-pink-50 hover:bg-pink-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {index + 1}
                      </td>

                      {/* Student Roll + eye icon */}
                      <td className="px-4 py-3 text-sm font-mono text-slate-700">
                        <div className="flex items-center gap-2">
                          <span>{student.rollNo || "—"}</span>
                          <button
                            type="button"
                            onClick={() =>
                              openActionModal("view", enrollment)
                            }
                            className="p-1.5 rounded-full border border-pink-100 text-pink-500 hover:bg-pink-50 shadow-sm transition"
                            title="View Student Details"
                          >
                            <FiEye size={16} />
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {student.name || "—"}
                      </td>

                      <td className="px-4 py-3 text-sm font-mono text-slate-700">
                        {course.courseCode || "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {course.courseName || "—"}
                      </td>

                      {/* Approve / Reject actions */}
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              openActionModal("approve", enrollment)
                            }
                            className="
                              px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1
                              border transition shadow-sm
                              bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100
                            "
                          >
                            <FiCheck size={14} />
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openActionModal("reject", enrollment)
                            }
                            className="
                              px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1
                              border transition shadow-sm
                              bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100
                            "
                          >
                            <FiX size={14} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!loading && enrollments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-500 text-sm"
                    >
                      No enrollment requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-md w-full mx-4 p-6">
            {selectedAction.type === "view" ? (
              (() => {
                const s = selectedAction.enrollment.student || {};
                const c =
                  selectedAction.enrollment.offering?.course || {};
                return (
                  <>
                    <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <span className="h-10 w-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                        <FiUser />
                      </span>
                      Student Details
                    </h3>

                    <div className="space-y-2 text-sm text-slate-700 mb-6">
                      <p>
                        <strong>Roll No:</strong> {s.rollNo || "—"}
                      </p>
                      <p>
                        <strong>Name:</strong> {s.name || "—"}
                      </p>
                      <p className="flex items-center gap-2">
                        <FiMail className="text-pink-500" />
                        <span>
                          <strong>Email:</strong> {s.email || "—"}
                        </span>
                      </p>
                      <p>
                        <strong>Department:</strong> {s.department || "—"}
                      </p>
                      <p>
                        <strong>Batch:</strong> {s.batch || "—"}
                      </p>
                      <p>
                        <strong>Current Semester:</strong>{" "}
                        {s.currentSemester || "—"}
                      </p>
                      <p className="flex items-center gap-2 mt-2">
                        <FiBookOpen className="text-pink-500" />
                        <span>
                          <strong>Course:</strong>{" "}
                          {c.courseCode || "—"} – {c.courseName || "—"}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 mt-2">
                        <FiCalendar className="text-pink-500" />
                        <span>
                          <strong>Requested At:</strong>{" "}
                          {selectedAction.enrollment.createdAt
                            ? new Date(
                                selectedAction.enrollment.createdAt
                              ).toLocaleString()
                            : "—"}
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 rounded-full text-sm font-semibold border border-pink-100 text-slate-600 hover:bg-pink-50 transition"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-700 mb-3 flex items-center gap-2">
                  {selectedAction.type === "approve" ? (
                    <>
                      <span className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <FiCheck />
                      </span>
                      Confirm Approval
                    </>
                  ) : (
                    <>
                      <span className="h-10 w-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                        <FiX />
                      </span>
                      Confirm Rejection
                    </>
                  )}
                </h3>

                <p className="text-sm text-slate-600 mb-4">
                  Are you sure you want to{" "}
                  <span className="font-semibold">
                    {selectedAction.type === "approve" ? "approve" : "reject"}
                  </span>{" "}
                  enrollment for{" "}
                  <span className="font-semibold">
                    {selectedAction.enrollment.student?.name || "this student"}
                  </span>{" "}
                  (Roll No:{" "}
                  <span className="font-mono">
                    {selectedAction.enrollment.student?.rollNo || "—"}
                  </span>
                  ) in{" "}
                  <span className="font-semibold">
                    {
                      selectedAction.enrollment.offering?.course
                        ?.courseName
                    }
                  </span>
                  ?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-full text-sm font-semibold border border-pink-100 text-slate-600 hover:bg-pink-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={actionLoading}
                    className={`px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm transition
                      ${
                        selectedAction.type === "approve"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-rose-500 hover:bg-rose-600"
                      }
                      ${actionLoading ? "opacity-70 cursor-not-allowed" : ""}
                    `}
                  >
                    {actionLoading
                      ? "Processing..."
                      : selectedAction.type === "approve"
                      ? "Yes, Approve"
                      : "Yes, Reject"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveEnrollment;
