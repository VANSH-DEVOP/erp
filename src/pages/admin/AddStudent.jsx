import React, { useState } from "react";
import { FiUserPlus, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddStudent = () => {
  const [students, setStudents] = useState([
    { name: "", email: "", dept: "", address: "", phone: "" },
  ]);

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batch, setBatch] = useState("");

  // For remove-row confirmation
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [rowToRemove, setRowToRemove] = useState(null);

  // To disable confirm button while submitting
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...students];
    updated[index][name] = value;
    setStudents(updated);
  };

  const handleAddRow = () => {
    setStudents((prev) => [
      ...prev,
      { name: "", email: "", dept: "", address: "", phone: "" },
    ]);
  };

  // Helper: remove row by index
  const removeRow = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(
      updated.length
        ? updated
        : [{ name: "", email: "", dept: "", address: "", phone: "" }]
    );
  };

  // When clicking "Remove" button on a row
  const handleRemoveClick = (index) => {
    const stu = students[index];
    const hasAnyValue = Object.values(stu).some(
      (v) => v && String(v).trim() !== ""
    );

    if (hasAnyValue) {
      // Show confirmation modal
      setRowToRemove(index);
      setShowRemoveModal(true);
    } else {
      // Directly remove empty row
      removeRow(index);
    }
  };

  // Confirm removal from modal
  const handleConfirmRemove = () => {
    if (rowToRemove !== null) {
      removeRow(rowToRemove);
    }
    setRowToRemove(null);
    setShowRemoveModal(false);
  };

  const handleCancelRemove = () => {
    setRowToRemove(null);
    setShowRemoveModal(false);
  };

  // Open modal when clicking "Save All Students"
  const handleOpenBatchModal = (e) => {
    e.preventDefault();
    const cleaned = students.filter(
      (s) => s.name || s.email || s.dept || s.address || s.phone
    );
    if (!cleaned.length) {
      toast.error("Please enter at least one student.");
      return;
    }
    setShowBatchModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!batch.trim()) {
      toast.error("Please enter batch.");
      return;
    }

    const cleaned = students.filter(
      (s) => s.name || s.email || s.dept || s.address || s.phone
    );

    if (!cleaned.length) {
      toast.error("Please enter at least one student.");
      return;
    }

    // Shape data exactly as backend expects: { students: [ { name, email, dept, address, phone, batch } ] }
    const payload = cleaned.map((s) => ({
      name: s.name,
      email: s.email,
      dept: s.dept.toUpperCase(), // important for rollNo generation
      address: s.address,
      phone: s.phone,
      batch: batch.trim(),
    }));

    const loadingId = toast.loading("Adding students...");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/admin/add-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ students: payload }),
      });

      const data = await res.json();
      toast.dismiss(loadingId);

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        setSubmitting(false);
        return;
      }

      const results = data.results || [];
      const success = results.filter((r) => r.status === "success").length;
      const failed = results.filter((r) => r.status === "failed").length;

      if (success > 0) {
        toast.success(`Successfully added ${success} student(s).`);
      }
      if (failed > 0) {
        toast.error(
          `${failed} student(s) failed (e.g. email already exists).`
        );
      }

      // Reset form
      setStudents([{ name: "", email: "", dept: "", address: "", phone: "" }]);
      setBatch("");
      setShowBatchModal(false);
    } catch (err) {
      console.error("Bulk add error:", err);
      toast.dismiss(loadingId);
      toast.error("Network error, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseBatchModal = () => {
    if (!submitting) {
      setShowBatchModal(false);
      setBatch("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        Add Multiple Students
      </h1>

      {/* Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <span className="h-12 w-12 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
              <FiUserPlus />
            </span>
            Student Details
          </h2>
          <p className="text-sm text-slate-500">
            Admin can add multiple students at once.
          </p>
        </div>

        <form className="space-y-4">
          {/* Table headers */}
          <div className="hidden md:grid md:grid-cols-[1.2fr_1.4fr_1fr_1.8fr_1fr_80px] gap-3 text-xs font-semibold text-slate-500 mb-1 px-1">
            <span>Name</span>
            <span>Email</span>
            <span>Dept</span>
            <span>Address</span>
            <span>Phone</span>
            <span className="text-center">Remove</span>
          </div>

          {/* Dynamic Input Rows */}
          <div className="space-y-3">
            {students.map((stu, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_1fr_1.7fr_1fr_80px] gap-3 items-center bg-pink-50/40 border border-pink-100 rounded-2xl px-3 py-3 sm:px-4 sm:py-4"
              >
                <input
                  name="name"
                  placeholder="Full Name"
                  value={stu.name}
                  onChange={(e) => handleChange(index, e)}
                  className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-pink-200 outline-none"
                />

                <input
                  name="email"
                  placeholder="Email"
                  value={stu.email}
                  onChange={(e) => handleChange(index, e)}
                  className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-pink-200 outline-none"
                />

                {/* Dept dropdown */}
                <select
                  name="dept"
                  value={stu.dept}
                  onChange={(e) => handleChange(index, e)}
                  className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-pink-200 outline-none"
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EE">EE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                </select>

                <input
                  name="address"
                  placeholder="Address"
                  value={stu.address}
                  onChange={(e) => handleChange(index, e)}
                  className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-pink-200 outline-none"
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  value={stu.phone}
                  onChange={(e) => handleChange(index, e)}
                  className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-pink-200 outline-none"
                />

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveClick(index)}
                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition shadow-sm"
                  >
                    <FiTrash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-pink-100 mt-4">
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-100 transition shadow-sm"
            >
              <FiUserPlus size={16} />
              Add Another
            </button>

            <button
              type="button"
              onClick={handleOpenBatchModal}
              className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 transition"
            >
              Save All Students
            </button>
          </div>
        </form>
      </div>

      {/* Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-700 mb-3">
              Set Batch for Students
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Enter the <span className="font-semibold">batch</span> that will
              be assigned to all the students you are adding.
            </p>

            <input
              type="text"
              placeholder="e.g., 2023-2027"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-pink-200 outline-none mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseBatchModal}
                disabled={submitting}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-pink-100 text-slate-600 hover:bg-pink-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm bg-pink-500 hover:bg-pink-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Row Confirmation Modal */}
      {showRemoveModal && rowToRemove !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-700 mb-3">
              Remove this student row?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This row contains filled data. Are you sure you want to{" "}
              <span className="font-semibold text-rose-600">remove</span> it?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelRemove}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-pink-100 text-slate-600 hover:bg-pink-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm bg-rose-500 hover:bg-rose-600 transition"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStudent;
