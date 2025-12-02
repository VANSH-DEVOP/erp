import React from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const options = [
    { title: "Profile", path: "/student/profile" },
    { title: "Current Courses", path: "/student/current-courses" },
    { title: "Registration", path: "/student/registration" },
  ];

  return (
    <div className="flex h-screen w-full bg-white p-6">

      {/* LEFT PANEL */}
      <div className="w-1/4 border-r border-gray-300 pr-6 flex flex-col space-y-4">

        {/* Green Icon Box */}
        <div
          className="h-14 w-14 rounded-xl"
          style={{ backgroundColor: "#59ce8f" }}
        ></div>

        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <p className="text-gray-600">Welcome Student 👋</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-3/4 pl-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-xl shadow-sm cursor-pointer transition transform hover:-translate-y-1 hover:shadow-md"
            style={{ backgroundColor: "#e8f9fd" }}
            onClick={() => navigate(item.path)}
          >
            <h3 className="text-lg font-semibold mb-3">{item.title}</h3>

            <button
              className="px-4 py-2 rounded-lg text-white font-semibold"
              style={{ backgroundColor: "#ff1e00" }}
            >
              Open
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StudentDashboard;
