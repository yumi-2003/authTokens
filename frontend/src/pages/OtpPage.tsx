import React, { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { verifyOtp } from "../features/auth/authThunks";
import { useLocation, useNavigate } from "react-router-dom";

const OtpPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(verifyOtp({ email, otp }));
    if (verifyOtp.fulfilled.match(result)) {
      navigate("/login");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-lg p-8 md:p-10 border border-[var(--border-color)] transition-all">
        <h2 className="text-2xl font-semibold text-[var(--text-heading)] mb-6 text-center">
          Verify OTP
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--border-color)] bg-white px-4 py-3 text-[var(--text-body)] focus:outline-none focus:ring-2 focus-ring-[var(--color-bazaar-200)] focus:border-[var(--color-accent)] transition"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-white px-4 py-3 text-[var(--text-body)] focus:outline-none focus:ring-2 focus-ring-[var(--color-bazaar-200)] focus:border-[var(--color-accent)] transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium py-3 rounded-lg shadow-md transition duration-200"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
