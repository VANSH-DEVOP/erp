import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMsg("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.post("/api/auth/forgot-password", { email });

      navigate("/otp", {
        state: {
            email,
            purpose: "reset-password"
        }
        });

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Server error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-pink-100 max-w-md w-full text-center">
        
        <h1 className="text-3xl font-bold text-slate-700 mb-3">
          Forgot Password
        </h1>
        <p className="text-slate-500 mb-6">
          Enter your registered email. We will send you an OTP to reset password.
        </p>

        <input
          type="email"
          placeholder="Registered Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-300 outline-none"
        />

        {errorMsg && (
          <p className="text-red-500 mt-3 text-sm">{errorMsg}</p>
        )}

        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="
            mt-6 w-full py-3 rounded-xl text-white font-semibold 
            bg-pink-400 hover:bg-pink-500 transition-all
            disabled:opacity-50
          "
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-purple-500 cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}
