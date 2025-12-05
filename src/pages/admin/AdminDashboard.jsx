import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiBook, FiLayers, FiPlusCircle, FiUserPlus, FiLogOut } from "react-icons/fi";
import DepartmentPie from "../../components/DepartmentPie";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token if using auth
    navigate("/");
    localStorage.removeItem("token");
    
  };

  const options = [
    { title: "Add Student", icon: <FiUserPlus size={30} />, path: "/admin/add-student" },
    { title: "Add Faculty", icon: <FiUserPlus size={30} />, path: "/admin/add-faculty" },
    { title: "All Courses", icon: <FiBook size={30} />, path: "/admin/all-courses" },
    { title: "Create Course Offering", icon: <FiPlusCircle size={30} />, path: "/admin/create-course-offering" },
    { title: "View All Students", icon: <FiUsers size={30} />, path: "/admin/view-all-students" },
    { title: "View All Faculty", icon: <FiUsers size={30} />, path: "/admin/view-all-faculty" },
    { title: "Current Offerings", icon: <FiLayers size={30} />, path: "/admin/view-current-offerings" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10 relative">

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-400 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-500 transition"
      >
        <FiLogOut size={18} /> Logout
      </button>

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-slate-600">Admin Dashboard</h1>
      </div>

      {/* FUNCTIONALITY TILES */}
      <div className="grid max-w-5xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {options.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            className="
              bg-white rounded-[28px] p-4
              border border-pink-100
              shadow-md hover:shadow-xl
              hover:-translate-y-[3px]
              transition-all cursor-pointer flex items-center gap-4
            "
          >
            <div className="
              h-14 w-14 rounded-2xl bg-pink-100 text-pink-500 
              flex items-center justify-center shadow
            ">
              {React.cloneElement(item.icon, { size: 24 })}
            </div>

            <div className="flex flex-col">
              <h2 className="text-[17px] font-semibold text-slate-700 leading-tight">
                {item.title}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Tap to open →
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* DEPARTMENT CHART */}
      <div className="max-w-5xl mx-auto mt-10 bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
        <DepartmentPie />
      </div>

    </div>
  );
};

export default AdminDashboard;
