import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiBookOpen,
  FiCalendar,
  FiHash,
  FiCheckSquare,
  FiLayers
} from "react-icons/fi";

const StudentProfile = () => {
  const navigate = useNavigate();

  // TEMPORARY STATIC DATA — replace with backend later
  const student = {
    name: "Ankit Sharma",
    email: "ankit.sharma@university.edu",
    phone: "+91 9123456780",
    address: "42, Knowledge Street, Jaipur, Rajasthan",
    department: "Computer Science",
    rollno: "CS2023A050",
    joined: "10 July 2023"
  };

  const actions = [
    {
      title: "Course Registration",
      icon: <FiCheckSquare size={26} />,
      path: "/student/registration",
    },
    {
      title: "My Current Courses",
      icon: <FiLayers size={26} />,
      path: "/student/current-courses",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] px-8 py-10">

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-slate-700 text-center mb-10">
        Student Profile
      </h1>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-10">
        
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow">
            <FiUser size={40} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-700">{student.name}</h2>
            <p className="text-slate-500">{student.department} Department</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-700">

          <div className="flex items-center gap-3">
            <FiMail size={22} className="text-pink-500" />
            <p><strong>Email:</strong> {student.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <FiPhone size={22} className="text-pink-500" />
            <p><strong>Phone:</strong> {student.phone}</p>
          </div>

          <div className="flex items-center gap-3">
            <FiHome size={22} className="text-pink-500" />
            <p><strong>Address:</strong> {student.address}</p>
          </div>

          <div className="flex items-center gap-3">
            <FiBookOpen size={22} className="text-pink-500" />
            <p><strong>Roll No:</strong> {student.rollno}</p>
          </div>

          <div className="flex items-center gap-3">
            <FiHash size={22} className="text-pink-500" />
            <p><strong>Department:</strong> {student.department}</p>
          </div>

          <div className="flex items-center gap-3">
            <FiCalendar size={22} className="text-pink-500" />
            <p><strong>Joined (Year):</strong> {student.joined.split(" ")[2]}</p>
          </div>

        </div>

        {/* Action Buttons */}
        <h3 className="text-xl font-semibold text-slate-600 mt-10 mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {actions.map((action, i) => (
            <div
              key={i}
              onClick={() => navigate(action.path)}
              className="
                bg-white rounded-2xl p-4
                border border-pink-100
                shadow hover:shadow-xl hover:-translate-y-1
                transition-all cursor-pointer flex items-center gap-4
              "
            >
              <div className="h-14 w-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center shadow">
                {action.icon}
              </div>

              <p className="text-slate-700 font-semibold">{action.title}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
