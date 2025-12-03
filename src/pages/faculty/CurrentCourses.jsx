import React, { useState, useEffect } from "react";
import { FiBookOpen, FiUsers } from "react-icons/fi";

const FacultyCurrentCourses = () => {
  const [offerings, setOfferings] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [selectedOffeeringStudents, setSelectedOfferingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api/faculty";


  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${API_URL}/my-offerings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch offerings");
        }

        const data = await response.json();
        setOfferings(data.offerings || []);

        // Select first offering by default
        if (data.offerings && data.offerings.length > 0) {
          setSelectedOffering(data.offerings[0]);
          fetchStudentsForOffering(data.offerings[0]._id, token);
        }
      } catch (err) {
        console.error("Error fetching offerings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  // Fetch students for selected offering
  const fetchStudentsForOffering = async (offeringId, token = null) => {
    try {
      const authToken = token || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/offerings/${offeringId}/students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setSelectedOfferingStudents(data.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.message);
    }
  };

  const handleCourseSelect = (offering) => {
    setSelectedOffering(offering);
    fetchStudentsForOffering(offering._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] px-8 py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] px-8 py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-700 text-center mb-10">
        Courses You Teach
      </h1>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-6 sm:p-8">
        <div className="grid md:grid-cols-[1fr,1.55fr] gap-6">
          
          {/* LEFT — Course List */}
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="h-9 w-9 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                <FiBookOpen />
              </span>
              Course List
            </h2>

            {offerings.length === 0 ? (
              <p className="text-slate-600 text-sm">No courses assigned.</p>
            ) : (
              <ul className="space-y-3">
                {offerings.map((offering) => (
                  <li
                    key={offering._id}
                    onClick={() => handleCourseSelect(offering)}
                    className={`px-4 py-3 rounded-2xl border transition shadow-sm cursor-pointer
                      ${
                        selectedOffering?._id === offering._id
                          ? "bg-pink-50 border-pink-300"
                          : "bg-white border-pink-100 hover:bg-pink-50/60"
                      }`}
                  >
                    <div className="font-semibold text-sm text-slate-800">
                      {offering.courseCode} – {offering.courseName}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Dept: <b>{offering.department}</b> • Sem: <b>{offering.semester}</b>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RIGHT — Course Details */}
          {selectedOffering ? (
            <div className="bg-pink-50/40 border border-pink-100 rounded-2xl p-4 sm:p-5 overflow-x-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedOffering.courseCode} – {selectedOffering.courseName}
                </h3>
                <span className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-9 w-9 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                    <FiUsers />
                  </span>
                  {selectedOffeeringStudents.length} students
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                Department: <b>{selectedOffering.department}</b> • Semester:{" "}
                <b>{selectedOffering.semester}</b>
              </p>

              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                Enrolled Students
              </h4>

              <div className="overflow-x-auto bg-white rounded-xl border border-pink-100 shadow-sm">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-pink-50 border-b border-pink-100">
                      <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                        #
                      </th>
                      <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                        Roll No
                      </th>
                      <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600">
                        Student Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOffeeringStudents.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-center text-slate-600">
                          No enrolled students
                        </td>
                      </tr>
                    ) : (
                      selectedOffeeringStudents.map((stu, index) => (
                        <tr
                          key={stu._id}
                          className="border-b border-pink-50 last:border-b-0 hover:bg-pink-50/50 transition-colors"
                        >
                          <td className="px-4 py-2.5 text-xs sm:text-sm text-slate-600">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-700">
                            {stu.rollNo}
                          </td>
                          <td className="px-4 py-2.5 text-xs sm:text-sm text-slate-700">
                            {stu.name}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-pink-50/40 border border-pink-100 rounded-2xl p-4 sm:p-5 flex items-center justify-center">
              <p className="text-slate-600">Select a course to view details</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FacultyCurrentCourses;
