import React, { useState } from "react";
import { FiUserPlus } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddFaculty = () => {
  const [form, setForm] = useState({
    designation: "",
    name: "",
    email: "",
    address: "",
    phone: "",
    department: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dropdown options
  const designations = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Senior Lecturer",
    "Lecturer",
  ];

  const departments = ["CSE", "IT", "ECE", "EE", "ME", "CE"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      designation: "",
      name: "",
      email: "",
      address: "",
      phone: "",
      department: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.designation || !form.department) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token"); // admin token

      const res = await fetch(`${API_URL}/api/admin/add-faculty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          department: form.department,
          designation: form.designation,
          // If your User schema supports these, keep them; otherwise backend will just ignore
          address: form.address,
          phone: form.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add faculty");
      }

      setSuccess(data.message || "Faculty created and credentials emailed.");
      resetForm();
    } catch (err) {
      console.error("Add faculty error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 sm:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        Add Faculty
      </h1>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <span className="h-12 w-12 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
              <FiUserPlus />
            </span>
            Faculty Details
          </h2>
          <p className="text-sm text-slate-500">
            Fill the form to add a new faculty.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Designation + Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Designation Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Designation <span className="text-rose-500">*</span>
              </label>
              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 outline-none"
              >
                <option value="">Select Designation</option>
                {designations.map((d, idx) => (
                  <option key={idx} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Name <span className="text-rose-500">*</span>
              </label>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 outline-none"
              />
            </div>
          </div>

          {/* Row 2: Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Phone
              </label>
              <input
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 outline-none"
              />
            </div>
          </div>

          {/* Row 3: Department Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 outline-none"
            >
              <option value="">Select Department</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Address
            </label>
            <textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-pink-100 mt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-full text-sm font-semibold border border-pink-100 text-slate-600 hover:bg-pink-50 transition"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition
                ${
                  submitting
                    ? "bg-pink-300 cursor-not-allowed"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
            >
              {submitting ? "Saving..." : "Save Faculty"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFaculty;
