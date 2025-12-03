import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // Get all courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await axios.get("/api/courses");
        const facultyRes = await axios.get("/api/users?role=Faculty");
        setCourses(coursesRes.data);
        setInstructors(facultyRes.data);
      } catch (error) {
        console.log(error);
        setMessage("Error fetching course/instructor data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/offerings/create", formData);
      setMessage("Course Offering Created Successfully");
      setFormData({
        course: "",
        instructor: "",
        semester: "",
        department: "",
        maxSeats: "",
      });
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message)
        setMessage(err.response.data.message);
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
          <label className="block font-medium">Course</label>
          <select
            required
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseCode} — {c.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Instructor */}
        <div>
          <label className="block font-medium">Instructor</label>
          <select
            required
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Instructor</option>
            {instructors.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name} ({i.employeeId})
              </option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block font-medium">Semester</label>
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
          <label className="block font-medium">Department</label>
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
          <label className="block font-medium">Max Seats</label>
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
