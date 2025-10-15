import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { forgotPassword } from "../features/auth/authThunks";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { loading, message, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handlesubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warn("Please enter your email address");
      return;
    }
    dispatch(forgotPassword(email));
    setTimeout(() => {
      navigate("/reset-password", { state: { email } });
    }, 1500);
  };
  //show taost when message or error changes
  useEffect(() => {
    if (message) toast.success(message);
    if (error) toast.error(error);
  }, [message, error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-lg p-8 md:p-10 border border-[var(--border-color)] transition-all">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--text-primary)]">
          Forgot Password
        </h2>
        <form onSubmit={handlesubmit} className="space-y-4">
          <div className="relative">
            <Mail
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-bazaar-500)]"
              size={18}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg border border-[var(--border-color)] bg-white text-[var(--text-body)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-bazaar-200)] transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full  bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium py-2 roudned-log transition${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
