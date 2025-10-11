import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { resetPassword } from "../features/auth/authThunks";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { KeyRound, Eye, EyeOff } from "lucide-react";

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(
        "Invalid or missing email. Please try again from the reset link."
      );
      return;
    }
    if (!otp.trim() || !newPassword.trim()) {
      toast.warn("Please fill in all fields");
      return;
    }
    try {
      await dispatch(resetPassword({ email, otp, newPassword })).unwrap();
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error: any) {
      toast.error(error || "Failed to reset password. Try again!");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-lg p-8 border border-[var(--border-color)]">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--text-body)]">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* OTP Field */}
          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-[var(--border-color)] bg-white text-[var(--text-body)] placeholder:text-[var(--color-bazaar-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
            />
            <KeyRound
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-bazaar-500)]"
            />
          </div>

          {/* New Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-[var(--border-color)] bg-white text-[var(--text-body)] placeholder:text-[var(--color-bazaar-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--color-bazaar-500)] hover:text-[var(--color-accent)]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 font-semibold rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]"
            } transition`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
