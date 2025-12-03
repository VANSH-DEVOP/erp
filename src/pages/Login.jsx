import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();

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

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#e0f2fe");
    gradient.addColorStop(1, "#f9a8d4");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Text styling
    ctx.font = "28px Comic Sans MS";
    ctx.fillStyle = "#0f172a";

    // Random tilt / skew
    const x = 15;
    const y = 35;
    const angle = (Math.random() - 0.5) * 0.6; // -0.3 to 0.3 rad
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(text, 0, 0);
    ctx.restore();

    // Random lines
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.strokeStyle = `rgba(15,23,42,${0.3 + Math.random() * 0.5})`;
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.stroke();
    }

    // Random dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(15,23,42,${Math.random()})`;
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        2,
        2
      );
    }
  };

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(text);

    // Draw after DOM updated
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

  // When switching role, clear fields + errors (nice UX)
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
      const msg = err.response?.data?.message || "Login failed. Please try again.";
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
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-100 p-8">
        {/* Small badge */}
        <div className="flex flex-col items-center mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-500 border border-pink-100">
            Online Course Registration System
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-slate-800 mb-1">
          Login Portal
        </h1>
        <p className="text-center text-sm text-slate-500 mb-6">
          Sign in as a{" "}
          <span className="font-semibold text-pink-500">
            {role === "student" ? "Student" : "Faculty"}
          </span>
        </p>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6 gap-3">
          <button
            onClick={() => handleRoleChange("student")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${
                role === "student"
                  ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                  : "bg-pink-50 text-pink-500 border border-pink-100"
              }`}
          >
            Student
          </button>

          <button
            onClick={() => handleRoleChange("faculty")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${
                role === "faculty"
                  ? "bg-purple-500 text-white shadow-md shadow-purple-200"
                  : "bg-purple-50 text-purple-500 border border-purple-100"
              }`}
          >
            Faculty
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {role === "student" && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNo"
                placeholder="e.g. 23CSE001"
                value={formData.rollNo}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
              />
            </div>
          )}

          {role === "faculty" && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Faculty ID
              </label>
              <input
                type="text"
                name="facultyId"
                placeholder="e.g. FAC001"
                value={formData.facultyId}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-400 outline-none text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
            />
          </div>
        </div>

        {/* CAPTCHA */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Security Check
          </label>

          {/* Canvas Captcha Image */}
          <canvas
            id="captchaCanvas"
            width="200"
            height="60"
            className="rounded-xl border border-slate-300 mb-2 bg-slate-200 select-none w-full"
          ></canvas>

          <button
            type="button"
            onClick={generateCaptcha}
            className="text-xs text-pink-500 font-semibold hover:underline mb-2"
          >
            Refresh Captcha
          </button>

          <input
            type="text"
            placeholder="Enter Captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-300 text-sm outline-none"
          />
        </div>

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="mt-3 text-sm text-pink-500 font-semibold cursor-pointer hover:underline text-right"
        >
          Forgot Password?
        </p>

        {/* ERROR */}
        {errorMsg && (
          <p className="text-red-500 text-sm mt-3 text-center">{errorMsg}</p>
        )}

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`mt-6 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all
            ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Small footer */}
        <p className="mt-4 text-[11px] text-center text-slate-400">
          © {new Date().getFullYear()} Course Registration System
        </p>
      </div>
    </div>
  );
};

export default Login;
