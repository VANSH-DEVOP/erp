import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMsg("Please enter your registered email.");
      setSuccessMsg("");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });

      // Optional success message (backend sends: { message, email })
      setSuccessMsg(res.data?.message || "OTP sent to your email.");

      // Navigate to common OTP page with purpose = reset-password
      navigate("/otp", {
        state: {
          email,
          purpose: "reset-password",
        },
      });
    } catch (err) {
      setSuccessMsg("");
      setErrorMsg(
        err.response?.data?.message || "Server error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="bg-white rounded-2xl px-6 py-6 shadow-sm border border-slate-100 max-w-sm w-full">
        {/* Header */}
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
          Forgot password
        </h1>
        <p className="text-xs text-slate-500 mb-5">
          Enter your registered email address and we&apos;ll send you an OTP to
          reset your password.
        </p>

        {/* Email input */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-500">
            Registered email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#94a3b8] outline-none text-xs"
          />
        </div>

        {/* Error */}
        {errorMsg && (
          <p className="text-[11px] text-red-500 mt-2 text-center">
            {errorMsg}
          </p>
        )}

        {/* Success */}
        {successMsg && (
          <p className="text-[11px] text-emerald-600 mt-2 text-center">
            {successMsg}
          </p>
        )}

        {/* Send OTP button */}
        <button
          onClick={handleSendOtp}
          disabled={loading}
          className={`mt-4 w-full bg-[#94a3b8] text-white py-2.5 rounded-xl font-semibold text-xs shadow-sm hover:bg-[#64748b] transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* Back to login */}
        <p
          onClick={() => navigate("/")}
          className="mt-4 text-xs text-[#f472b6] font-semibold cursor-pointer hover:underline text-center"
        >
          Back to login
        </p>

        {/* Small footer */}
        <p className="mt-3 text-[10px] text-center text-slate-400">
          © {new Date().getFullYear()} Course Registration System
        </p>
      </div>
    </div>
  );
}
