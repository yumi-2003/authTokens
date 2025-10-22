import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { verifyOtp, resendOtp } from "../features/auth/authThunks";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OtpPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email || "";

  const [email] = useState(emailFromState);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleResend = async () => {
    if (timer > 0) {
      toast.info(`Please wait ${Math.floor(timer / 60)}m ${timer % 60}s`);
      return;
    }
    try {
      await dispatch(resendOtp(email)).unwrap();
      toast.success("OTP resent successfully!");
      setTimer(60);
    } catch (err: unknown) {
      const message =
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : JSON.stringify(err) || "Failed to resend OTP";
      toast.error(message);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return toast.error("Please enter full OTP");

    try {
      const result = await dispatch(verifyOtp({ email, otp: code })).unwrap();

      // Assuming result contains user info
      const user = result.user;
      if (!user) throw new Error("Invalid user data from OTP verification");

      toast.success("OTP verified successfully!");

      // Navigate to the correct dashboard
      if (user.role === "admin") navigate("/dashboard/admin");
      else navigate("/dashboard/user");
    } catch (err: unknown) {
      const message =
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : JSON.stringify(err) || "OTP verification failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-body) px-4">
      <div className="w-full max-w-md bg-(--bg-card) rounded-2xl shadow-lg p-8 md:p-10 border border-(--border-color) transition-all">
        <h2 className="text-2xl font-semibold text-(--text-heading) mb-6 text-center">
          Verify Your Granted Access!!!
        </h2>
        <p className="text-(--color-bazaar-600) text-sm mb-8">
          Enter the code sent to your email
          <span>({email.replace(/(.{2}).+(@.*)/, "$1******$2")})</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-(--border-color) rounded-lg focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-bazaar-200) outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full text-white font-semibold bg-linear-to-r from-pink-500 to-orange-400 hover:opacity-90 shadow-md transition"
          >
            Verify OTP
          </button>
        </form>
        <div className="flex flex-col items-center gap-4 mt-4">
          <p className="text-sm text-gray-600">Didn’t receive the code?</p>
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`w-full px-4 py-2 rounded-full font-semibold transition-all ${
              timer > 0
                ? "bg-(--color-bazaar-200) text-(--color-bazaar-500) cursor-not-allowed"
                : "bg-(--color-accent) hover:bg-(--color-accent-hover) text-white shadow-sm"
            }`}
          >
            {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
