import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/admin";

const CreateCourseOffering = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [formData, setFormData] = useState({
    course: "",
    instructor: "",
    semester: "",
    department: "",
    maxSeats: "",
  });

  const [message, setMessage] = useState("");

  // 🔐 Fetch token from localStorage
  const token = localStorage.getItem("token");

  // Get all courses + faculty
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const coursesRes = await axios.get(`${API_BASE_URL}/courses`, {
          headers,
        });
        const facultyRes = await axios.get(`${API_BASE_URL}/faculties`, {
          headers,
        });

        const coursesData = Array.isArray(coursesRes.data)
          ? coursesRes.data
          : Array.isArray(coursesRes.data?.courses)
          ? coursesRes.data.courses
          : [];

        const instructorsData = Array.isArray(facultyRes.data)
          ? facultyRes.data
          : Array.isArray(facultyRes.data?.users)
          ? facultyRes.data.users
          : Array.isArray(facultyRes.data?.faculties)
          ? facultyRes.data.faculties
          : [];

        setCourses(coursesData);
        setInstructors(instructorsData);
      } catch (error) {
        console.error("Error fetching course/instructor data:", error);
        setMessage("Error fetching course/instructor data");
        setCourses([]);
        setInstructors([]);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        courseId: formData.course,
        instructorId: formData.instructor,
        semester: Number(formData.semester),
        department: formData.department,
        maxSeats: Number(formData.maxSeats),
      };

      const res = await axios.post(
        `${API_BASE_URL}/offerings/create-offering`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Create offering response:", res.data);
      setMessage("✅ Course Offering Created Successfully");
      setFormData({
        course: "",
        instructor: "",
        semester: "",
        department: "",
        maxSeats: "",
      });
    } catch (err) {
      console.error("Create offering error:", err);
      if (err.response?.data?.message) setMessage(err.response.data.message);
      else setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-br from-[#fdf2ff] via-[#f4fbff] to-[#fffdf5] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        {/* Page title / breadcrumb feel */}
        <div className="mb-6">
          <p className="text-xs font-medium tracking-wide text-blue-500 uppercase">
            Course Management
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-800">
            Create Course Offering
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure course, instructor, semester and seat capacity for the
            upcoming term.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur shadow-lg shadow-blue-100 border border-slate-100 rounded-2xl overflow-hidden">
          {/* Card header strip */}
          <div className="h-2 bg-gradient-to-r from-[#9adcff] via-[#f8a5c2] to-[#a3d8f4]" />

          <div className="p-5 sm:p-6">
            {message && (
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-800">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Top row: Course & Instructor */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9adcff] focus:border-[#9adcff] transition"
                  >
                    <option value="">Select Course</option>
                    {Array.isArray(courses) &&
                      courses.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.courseCode} — {c.courseName}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Instructor <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f8a5c2] focus:border-[#f8a5c2] transition"
                  >
                    <option value="">Select Instructor</option>
                    {Array.isArray(instructors) &&
                      instructors.map((i) => (
                        <option key={i._id} value={i._id}>
                          {i.name} {i.employeeId ? `(${i.employeeId})` : ""}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Second row: Semester & Department */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 5"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9adcff] focus:border-[#9adcff] transition"
                  />
                </div>

                {/* Department */}
<div>
  <label className="block text-sm font-medium text-slate-700 mb-1.5">
    Department <span className="text-red-500">*</span>
  </label>
  <select
    required
    name="department"
    value={formData.department}
    onChange={handleChange}
    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f8a5c2] focus:border-[#f8a5c2] transition"
  >
    <option value="">Select Department</option>
    <option value="CSE">CSE — Computer Science</option>
    <option value="ECE">ECE — Electronics & Communication</option>
    <option value="ME">ME — Mechanical</option>
    <option value="EE">EE — Electrical</option>
    <option value="CE">CE — Civil</option>
    <option value="IT">IT — Information Technology</option>
  </select>
</div>

              </div>

              {/* Max Seats */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Max Seats <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxSeats"
                    value={formData.maxSeats}
                    onChange={handleChange}
                    required
                    min={1}
                    placeholder="e.g. 60"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a3d8f4] focus:border-[#a3d8f4] transition"
                  />
                </div>

                {/* Helper card */}
                <div className="hidden sm:flex flex-col justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600 mb-1">
                    Tip
                  </span>
                  <span>
                    Max seats should align with classroom capacity and
                    department policies.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Fields marked with <span className="text-red-500">*</span> are
                  required.
                </p>
                <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#f8a5c2] px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-md shadow-pink-100 hover:bg-[#f48fb1] hover:shadow-lg hover:shadow-pink-200 active:scale-[0.97] transition"
              >
                Create Offering
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseOffering;
