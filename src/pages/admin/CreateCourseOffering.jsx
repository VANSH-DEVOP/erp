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

  // Get all courses + faculty
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await axios.get(`${API_BASE_URL}/courses`);
        const facultyRes = await axios.get(
          `${API_BASE_URL}/faculties`
        );

        console.log("Courses API:", coursesRes.data);
        console.log("Faculty API:", facultyRes.data);

        // Handle various shapes safely
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
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      courseId: formData.course,          // from your select name="course"
      instructorId: formData.instructor,  // from your select name="instructor"
      semester: Number(formData.semester),
      department: formData.department,
      maxSeats: Number(formData.maxSeats),
      // status: "OPEN", // optional, backend already defaults to OPEN
    };

    const res = await axios.post(
      `${API_BASE_URL}/offerings/create-offering`,
      payload
    );

    console.log("Create offering response:", res.data);
    setMessage("Course Offering Created Successfully");
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
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Course Offering</h2>

      {message && (
        <p className="mb-3 text-blue-700 font-semibold">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course */}
        <div>
          <label className="block font-medium mb-1">Course</label>
          <select
            required
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full border p-2 rounded"
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
          <label className="block font-medium mb-1">Instructor</label>
          <select
            required
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Instructor</option>
            {Array.isArray(instructors) &&
              instructors.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}{" "}
                  {i.employeeId ? `(${i.employeeId})` : ""}
                </option>
              ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block font-medium mb-1">Semester</label>
          <input
            type="number"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            placeholder="Example: 5"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block font-medium mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            placeholder="CSE / ECE / ME ..."
            className="w-full border p-2 rounded uppercase"
          />
        </div>

        {/* Max Seats */}
        <div>
          <label className="block font-medium mb-1">Max Seats</label>
          <input
            type="number"
            name="maxSeats"
            value={formData.maxSeats}
            onChange={handleChange}
            required
            min={1}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700"
        >
          Create Offering
        </button>
      </form>
    </div>
  );
};

export default CreateCourseOffering;
