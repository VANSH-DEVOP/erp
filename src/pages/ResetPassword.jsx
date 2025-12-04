import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  // ⛔ Prevent direct access (correct method)
  /* useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]); */

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleReset = async () => {
    setMsg("");

    if (!password || !confirm) {
      setMsg("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        newPassword: password,
      });

      setMsg("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setMsg(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-pink-100 max-w-md w-full text-center">

        <h1 className="text-3xl font-bold text-slate-700 mb-2">
          Reset Password
        </h1>

        <p className="text-slate-500 mb-6">
          Create a new password for{" "}
          <span className="font-semibold text-pink-500">{email}</span>
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full px-4 py-3 rounded-xl border border-pink-200 
            focus:ring-2 focus:ring-pink-300 outline-none mb-4
          "
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="
            w-full px-4 py-3 rounded-xl border border-pink-200 
            focus:ring-2 focus:ring-pink-300 outline-none
          "
        />

        {msg && (
          <p className="mt-3 text-sm text-red-500">{msg}</p>
        )}

        <button
          onClick={handleReset}
          disabled={loading}
          className="
            mt-6 w-full py-3 rounded-xl text-white font-semibold 
            bg-purple-400 hover:bg-purple-500 transition-all
            disabled:opacity-50
          "
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </div>
    </div>
  );
}
