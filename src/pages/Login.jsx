import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState("student"); // "student" | "faculty"

  const [formData, setFormData] = useState({
    rollNo: "",
    facultyId: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------------------
        CAPTCHA SYSTEM (REAL)
  --------------------------- */
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const drawCaptcha = (text) => {
    const canvas = document.getElementById("captchaCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background gradient (soft)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#e0f2fe");
    gradient.addColorStop(1, "#f9a8d4");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Text styling
    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "#0f172a";

    const x = 15;
    const y = 32;
    const angle = (Math.random() - 0.5) * 0.4;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(text, 0, 0);
    ctx.restore();

    // Random lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.strokeStyle = `rgba(15,23,42,${0.25 + Math.random() * 0.4})`;
      ctx.lineWidth = 1 + Math.random();
      ctx.stroke();
    }

    // Random dots
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `rgba(15,23,42,${Math.random()})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
  };

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(text);

    setTimeout(() => drawCaptcha(text), 50);
  };

  useEffect(() => {
    generateCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------
      HANDLE INPUT CHANGE
  --------------------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg("");
    setFormData({
      rollNo: "",
      facultyId: "",
      password: "",
    });
    setCaptchaInput("");
    generateCaptcha();
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
      setCaptchaInput("");
      return;
    }

    try {
      setLoading(true);

      if (role === "student") {
        if (!formData.rollNo || !formData.password) {
          setErrorMsg("Please fill all fields.");
          setLoading(false);
          return;
        }

        const res = await axios.post(
          `${API_BASE_URL}/auth/student/login`,
          {
            rollNo: formData.rollNo,
            password: formData.password,
          }
        );

        // Admin login case (token returned directly)
        if (res.data.token && res.data.user?.role === "Admin") {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Admin login successful");
          navigate("/admin/dashboard");
          return;
        }

        // Normal student login → OTP
        if (res.data.userId) {
          const pendingUser = {
            role: "Student",
            userId: res.data.userId,
          };
          localStorage.setItem("pendingUser", JSON.stringify(pendingUser));
          toast.success("OTP sent to your registered email");
          navigate("/otp");
          return;
        }
      } else {
        // Faculty Login
        if (!formData.facultyId || !formData.password) {
          setErrorMsg("Please fill all fields.");
          setLoading(false);
          return;
        }

        const res = await axios.post(
          `${API_BASE_URL}/auth/faculty/login`,
          {
            facultyId: formData.facultyId,
            password: formData.password,
          }
        );

        // Admin login via facultyId block
        if (res.data.token && res.data.user?.role === "Admin") {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Admin login successful");
          navigate("/admin/dashboard");
          return;
        }

        // Normal faculty login → OTP
        if (res.data.userId) {
          const pendingUser = {
            role: "Faculty",
            userId: res.data.userId,
          };
          localStorage.setItem("pendingUser", JSON.stringify(pendingUser));
          toast.success("OTP sent to your registered email");
          navigate("/otp");
          return;
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
      generateCaptcha();
      setCaptchaInput("");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------
          RETURN UI
  --------------------------- */
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-6">
        {/* Title */}
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">
          Welcome back
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          Sign in as{" "}
          <span className="font-semibold text-[#f472b6]">
            {role === "student" ? "Student" : "Faculty"}
          </span>
        </p>

        {/* Role Toggle - same colors for both */}
        <div className="flex justify-start mb-4 gap-2">
          <button
            onClick={() => handleRoleChange("student")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
              ${
                role === "student"
                  ? "bg-[#f472b6] text-white border-transparent shadow-sm"
                  : "bg-white text-[#f472b6] border-[#f9a8d4]"
              }`}
          >
            Student
          </button>

          <button
            onClick={() => handleRoleChange("faculty")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
              ${
                role === "faculty"
                  ? "bg-[#f472b6] text-white border-transparent shadow-sm"
                  : "bg-white text-[#f472b6] border-[#f9a8d4]"
              }`}
          >
            Faculty
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-3">
          {role === "student" && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNo"
                placeholder="e.g. 23CSE001"
                value={formData.rollNo}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#94a3b8] outline-none text-xs"
              />
            </div>
          )}

          {role === "faculty" && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Faculty ID
              </label>
              <input
                type="text"
                name="facultyId"
                placeholder="e.g. FAC001"
                value={formData.facultyId}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#94a3b8] outline-none text-xs"
              />
            </div>
          )}

          <div>
  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Enter password"
      value={formData.password}
      onChange={handleChange}
      className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#94a3b8] outline-none text-xs"
    />

    {/* Eye Icon */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
    >
      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
    </button>
  </div>
</div>

        </div>

        {/* CAPTCHA */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Security Check
            </label>
            <button
              type="button"
              onClick={generateCaptcha}
              className="text-[11px] font-semibold text-[#f472b6] hover:underline"
            >
              Refresh captcha
            </button>
          </div>

          <div className="flex items-center gap-3">
            <canvas
              id="captchaCanvas"
              width="160"
              height="50"
              className="rounded-lg border border-slate-200 bg-slate-100 select-none flex-shrink-0"
            ></canvas>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter captcha"
                value={captchaInput}
                onChange={(e) =>
                  setCaptchaInput(e.target.value.toUpperCase())
                }
                className="w-full px-3 py-2.5 rounded-xl border border-pink-100 focus:ring-2 focus:ring-[#f472b6] text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="mt-3 text-xs text-[#f472b6] font-semibold cursor-pointer hover:underline text-right"
        >
          Forgot password?
        </p>

        {/* ERROR */}
        {errorMsg && (
          <p className="text-[11px] text-red-500 mt-2 text-center">
            {errorMsg}
          </p>
        )}

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`mt-4 w-full bg-[#94a3b8] text-white py-2.5 rounded-xl font-semibold text-xs shadow-sm hover:bg-[#64748b] transition-all
            ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Small footer */}
        <p className="mt-3 text-[10px] text-center text-slate-400">
          © {new Date().getFullYear()} Course Registration System
        </p>
      </div>
    </div>
  );
};

export default Login;
