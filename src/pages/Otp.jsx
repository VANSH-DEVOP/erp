import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function Otp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data coming from Login OR Forgot Password
  const { userId, role, email, purpose } = location.state || {};

  // 🚫 BLOCK DIRECT ACCESS
  useEffect(() => {
    if (!purpose && (!userId || !role)) {
      navigate("/login");
    }
  }, []);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // -------------------- HANDLE OTP VERIFY --------------------
  const handleVerify = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      if (!otp) {
        setErrorMsg("Please enter the OTP");
        setLoading(false);
        return;
      }

      // ----------------------------------------------------------
      //  CASE 1: FORGOT PASSWORD OTP VERIFICATION
      // ----------------------------------------------------------
      if (purpose === "reset-password") {
        const res = await axios.post("/api/auth/verify-reset-otp", {
          email,
          otp,
        });

        navigate("/reset-password", {
          state: { email },
        });
        return;
      }

      // ----------------------------------------------------------
      //  CASE 2: NORMAL LOGIN OTP VERIFICATION
      // ----------------------------------------------------------
      const api =
        role === "Student"
          ? "/api/auth/verify-student-otp"
          : "/api/auth/verify-faculty-otp";

      const res = await axios.post(api, { userId, otp });

      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on role
      if (role === "Admin") navigate("/admin/dashboard");
      else if (role === "Faculty") navigate("/faculty/profile");
      else navigate("/student/profile");

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid OTP or server error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- UI SECTION --------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-pink-100 max-w-md w-full text-center">
        
        <h1 className="text-3xl font-bold text-slate-700 mb-2">
          OTP Verification
        </h1>

        <p className="text-slate-500 mb-6">
          Enter the 6-digit OTP sent to your registered email.
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="
            w-full px-5 py-3 rounded-xl border border-pink-200 
            focus:ring-2 focus:ring-pink-300 outline-none text-center 
            text-xl tracking-widest font-semibold text-gray-700
          "
          placeholder="••••••"
        />

        {errorMsg && (
          <p className="text-red-500 mt-3 text-sm">{errorMsg}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="
            mt-6 w-full py-3 rounded-xl text-white font-semibold 
            bg-pink-400 hover:bg-pink-500 transition-all
            disabled:opacity-50
          "
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
