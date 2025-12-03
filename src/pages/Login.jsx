import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("student"); // "student" | "faculty"

  const [formData, setFormData] = useState({
    rollNo: "",
    facultyId: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  /* ---------------------------
        CAPTCHA SYSTEM
  --------------------------- */
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(text);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  /* ---------------------------
      HANDLE INPUT CHANGE
  --------------------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------------------------
        LOGIN HANDLER
  --------------------------- */
  const handleLogin = async () => {
    setErrorMsg("");

    // Check captcha
    if (captchaInput !== captcha) {
      setErrorMsg("Invalid captcha. Please try again.");
      generateCaptcha();
      return;
    }

    if (role === "student") {
      if (!formData.rollNo || !formData.password) {
        setErrorMsg("Please fill all fields.");
        return;
      }
      console.log("Student login →", formData.rollNo, formData.password);
      // API call later
    } else {
      if (!formData.facultyId || !formData.password) {
        setErrorMsg("Please fill all fields.");
        return;
      }
      console.log("Faculty login →", formData.facultyId, formData.password);
      // API call later
    }
  };

  /* ---------------------------
          RETURN UI
  --------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-pink-100">

        <h1 className="text-3xl font-extrabold text-center text-slate-700 mb-6">
          Login Portal
        </h1>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6 gap-3">
          <button
            onClick={() => setRole("student")}
            className={`px-4 py-2 rounded-full font-semibold transition-all
              ${
                role === "student"
                  ? "bg-pink-400 text-white shadow"
                  : "bg-pink-100 text-pink-500"
              }`}
          >
            Student
          </button>

          <button
            onClick={() => setRole("faculty")}
            className={`px-4 py-2 rounded-full font-semibold transition-all
              ${
                role === "faculty"
                  ? "bg-purple-400 text-white shadow"
                  : "bg-purple-100 text-purple-500"
              }`}
          >
            Faculty
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {role === "student" && (
            <input
              type="text"
              name="rollNo"
              placeholder="Enter Roll Number"
              value={formData.rollNo}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
            />
          )}

          {role === "faculty" && (
            <input
              type="text"
              name="facultyId"
              placeholder="Enter Faculty ID"
              value={formData.facultyId}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* CAPTCHA */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="px-4 py-2 bg-slate-200 rounded-lg tracking-widest font-bold text-slate-600 text-lg">
              {captcha}
            </span>
            <button
              onClick={generateCaptcha}
              className="text-pink-500 font-semibold underline"
            >
              Refresh
            </button>
          </div>

          <input
            type="text"
            placeholder="Enter Captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="mt-3 text-sm text-pink-500 font-semibold cursor-pointer hover:underline"
        >
          Forgot Password?
        </p>

        {/* ERROR */}
        {errorMsg && (
          <p className="text-red-500 text-sm mt-3">{errorMsg}</p>
        )}

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition-all"
        >
          Login
        </button>

      </div>
    </div>
  );
};

export default Login;
