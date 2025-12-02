import React, { useState } from "react";
import {
  FiEye,
  FiCheck,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiCalendar,
  FiBookOpen,
} from "react-icons/fi";

const ApproveEnrollment = () => {
  // TEMPORARY STATIC DATA — replace with backend later
  const [enrollments, setEnrollments] = useState([
    {
      id: 1,
      studentId: "STU2023CS01",
      studentName: "Ankit Sharma",
      email: "ankit.sharma@university.edu",
      address: "42, Knowledge Street, Jaipur, Rajasthan",
      phone: "+91 9123456780",
      year: "2023",
      courseId: "CS101",
      courseName: "Data Structures",
    },
    {
      id: 2,
      studentId: "STU2023CS05",
      studentName: "Priya Verma",
      email: "priya.verma@university.edu",
      address: "21, Tech Park Road, Jaipur, Rajasthan",
      phone: "+91 9876501234",
      year: "2023",
      courseId: "CS105",
      courseName: "Operating Systems",
    },
    {
      id: 3,
      studentId: "STU2023IT02",
      studentName: "Rahul Mehta",
      email: "rahul.mehta@university.edu",
      address: "11, Innovation Colony, Jaipur, Rajasthan",
      phone: "+91 9000012345",
      year: "2022",
      courseId: "IT110",
      courseName: "Computer Networks",
    },
  ]);

  const [selectedAction, setSelectedAction] = useState(null); // { type, enrollment }
  const [showModal, setShowModal] = useState(false);

  const openActionModal = (type, enrollment) => {
    setSelectedAction({ type, enrollment });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAction(null);
  };

  const handleConfirm = () => {
    if (!selectedAction) return;

    const { type, enrollment } = selectedAction;

    // Assume all are pending; after approve/reject remove from list
    if (type === "approve" || type === "reject") {
      setEnrollments((prev) => prev.filter((item) => item.id !== enrollment.id));
    }

    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        Approve Enrollment Requests
      </h1>

      {/* Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-700">All Students</h2>
          <p className="text-sm text-slate-500">
            List of students requesting enrollment
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 border-b border-pink-100">
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  #
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Student ID
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Student Name
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                  Course ID
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
              {enrollments.map((enrollment, index) => (
                <tr
                  key={enrollment.id}
                  className="border-b border-pink-50 hover:bg-pink-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {index + 1}
                  </td>

                  {/* Student ID + eye icon */}
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">
                    <div className="flex items-center gap-2">
                      <span>{enrollment.studentId}</span>
                      <button
                        type="button"
                        onClick={() => openActionModal("view", enrollment)}
                        className="p-1.5 rounded-full border border-pink-100 text-pink-500 hover:bg-pink-50 shadow-sm transition"
                        title="View Student Details"
                      >
                        <FiEye size={16} />
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">
                    {enrollment.studentName}
                  </td>

                  <td className="px-4 py-3 text-sm font-mono text-slate-700">
                    {enrollment.courseId}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">
                    {enrollment.courseName}
                  </td>

                  {/* Approve / Reject actions */}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openActionModal("approve", enrollment)}
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
                        onClick={() => openActionModal("reject", enrollment)}
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
              ))}

              {enrollments.length === 0 && (
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
      </div>

      {/* Modal */}
      {showModal && selectedAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-md w-full mx-4 p-6">
            {selectedAction.type === "view" ? (
              <>
                <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="h-10 w-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                    <FiUser />
                  </span>
                  Student Details
                </h3>

                <div className="space-y-2 text-sm text-slate-700 mb-6">
                  <p>
                    <strong>Student ID:</strong>{" "}
                    {selectedAction.enrollment.studentId}
                  </p>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedAction.enrollment.studentName}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiMail className="text-pink-500" />
                    <span>
                      <strong>Email:</strong>{" "}
                      {selectedAction.enrollment.email}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FiHome className="text-pink-500" />
                    <span>
                      <strong>Address:</strong>{" "}
                      {selectedAction.enrollment.address}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FiPhone className="text-pink-500" />
                    <span>
                      <strong>Phone:</strong>{" "}
                      {selectedAction.enrollment.phone}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FiCalendar className="text-pink-500" />
                    <span>
                      <strong>Year:</strong> {selectedAction.enrollment.year}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 mt-2">
                    <FiBookOpen className="text-pink-500" />
                    <span>
                      <strong>Course:</strong>{" "}
                      {selectedAction.enrollment.courseId} –{" "}
                      {selectedAction.enrollment.courseName}
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
                    {selectedAction.enrollment.studentName}
                  </span>{" "}
                  (ID:{" "}
                  <span className="font-mono">
                    {selectedAction.enrollment.studentId}
                  </span>
                  ) in{" "}
                  <span className="font-semibold">
                    {selectedAction.enrollment.courseName}
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
                    className={`px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm transition
                      ${
                        selectedAction.type === "approve"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-rose-500 hover:bg-rose-600"
                      }
                    `}
                  >
                    {selectedAction.type === "approve"
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
