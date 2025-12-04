import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const [pendingUser, setPendingUser] = useState(null); // for login flow
  const [resetContext, setResetContext] = useState(null); // { email } for reset-password flow
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const isResetFlow = !!resetContext; // true when coming from ForgotPassword

  // Load pending user data (role + userId) OR reset-password context (email)
  useEffect(() => {
    const state = location.state;

    // ----- LOGIN FLOW CONTEXT (Student/Faculty) -----
    const fromStatePending = state?.pendingUser;
    if (fromStatePending) {
      setPendingUser(fromStatePending);
      localStorage.setItem("pendingUser", JSON.stringify(fromStatePending));
    } else {
      const storedPending = localStorage.getItem("pendingUser");
      if (storedPending) {
        setPendingUser(JSON.parse(storedPending));
      }
    }

    // ----- RESET-PASSWORD FLOW CONTEXT -----
    if (state?.purpose === "reset-password" && state?.email) {
      const ctx = { email: state.email };
      setResetContext(ctx);
      localStorage.setItem("resetPasswordContext", JSON.stringify(ctx));
    } else {
      const storedReset = localStorage.getItem("resetPasswordContext");
      if (storedReset) {
        setResetContext(JSON.parse(storedReset));
      }
    }
  }, [location.state]);

  const handleVerify = async () => {
    setErrorMsg("");

    // ---------------- RESET-PASSWORD FLOW ----------------
    if (isResetFlow) {
      const email = resetContext?.email;

      if (!email) {
        const msg = "No reset session found. Please try again.";
        setErrorMsg(msg);
        toast.error(msg);
        navigate("/forgot-password");
        return;
      }

      if (!otp) {
        setErrorMsg("Please enter the OTP.");
        return;
      }

      if (!newPassword || !confirmPassword) {
        setErrorMsg("Please enter and confirm your new password.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMsg("New password and confirm password do not match.");
        return;
      }

      try {
        setLoading(true);

        const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
          email,
          otp,
          newPassword,
        });

        const msg =
          res.data?.message || "Password reset successful. Please login.";

        // Clear reset context
        localStorage.removeItem("resetPasswordContext");

        toast.success(msg);
        navigate("/"); // back to login
      } catch (err) {
        console.error("Reset password OTP error:", err);
        const msg =
          err.response?.data?.message ||
          "Password reset failed. Please try again.";
        setErrorMsg(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }

      return;
    }

    // ---------------- LOGIN FLOW (EXISTING BEHAVIOR) ----------------
    if (!pendingUser || !pendingUser.userId || !pendingUser.role) {
      const msg =
        "No pending login session found. Please login again.";
      setErrorMsg(msg);
      toast.error("Session expired. Please login again.");
      navigate("/");
      return;
    }

    if (!otp) {
      setErrorMsg("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      let endpoint = "";
      if (pendingUser.role === "Student") {
        endpoint = "/auth/student/verify-otp";
      } else if (pendingUser.role === "Faculty") {
        endpoint = "/auth/faculty/verify-otp";
      } else {
        throw new Error("Invalid role in pending session.");
      }

      const res = await axios.post(`${API_BASE_URL}${endpoint}`, {
        userId: pendingUser.userId,
        otp,
      });

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid server response.");
      }

      // Save final auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("pendingUser");

      toast.success("Login successful");

      if (user.role === "Student") {
        navigate("/student/profile");
      } else if (user.role === "Faculty") {
        navigate("/faculty/profile");
      } else if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      const msg =
        err.response?.data?.message ||
        "OTP verification failed. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // If neither login nor reset context exists → show fallback
  if (!pendingUser && !resetContext) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
            Session Expired
          </h2>
          <p className="text-sm text-slate-500 mb-4 text-center">
            We couldn&apos;t find your session. Please try again.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow hover:opacity-95 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4 py-8">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-100 p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-500 border border-indigo-100">
            {isResetFlow ? "Reset Password OTP" : "OTP Verification"}
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-center text-slate-800 mb-2">
          {isResetFlow ? "Verify OTP & Reset" : "Enter OTP"}
        </h2>
        <p className="text-center text-sm text-slate-500 mb-6">
          {isResetFlow ? (
            <>
              We have sent a 6-digit OTP to your registered email{" "}
              <span className="font-semibold text-pink-500">
                {resetContext?.email}
              </span>{" "}
              to reset your password.
            </>
          ) : (
            <>
              We have sent a 6-digit OTP to your registered email for{" "}
              <span className="font-semibold text-pink-500">
                {pendingUser?.role === "Student" ? "Student" : "Faculty"} account
              </span>
              .
            </>
          )}
        </p>

        {/* OTP input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            OTP
          </label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.trim())}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none text-center tracking-[0.5em] text-lg font-semibold"
          />
        </div>

        {/* New password fields for reset-password flow */}
        {isResetFlow && (
          <>
            <div className="mb-3">
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
              />
            </div>
          </>
        )}

        {errorMsg && (
          <p className="text-red-500 text-sm mb-3 text-center">{errorMsg}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all
            ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading
            ? isResetFlow
              ? "Resetting..."
              : "Verifying..."
            : isResetFlow
            ? "Verify & Reset Password"
            : "Verify OTP"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Otp;
