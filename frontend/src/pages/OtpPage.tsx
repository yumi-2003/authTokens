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
  const [timer, setTimer] = useState(600);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  //countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  //format time mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  //handle resend button
  const handleResend = async () => {
    if (timer > 0) {
      toast.info(`Please wiat ${Math.floor(timer / 60)}m ${timer % 60}s}`);
      return;
    }
    try {
      await dispatch(resendOtp(email)).unwrap();
      toast.success("OTP resent successfully!");
      setTimer(600);
    } catch (err: any) {
      toast.error(err || "Failed to resend OTP");
    }
  };

  //handle OTP input
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
    const result = await dispatch(verifyOtp({ email, otp: code }));
    if (verifyOtp.fulfilled.match(result)) {
      navigate("/login");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-lg p-8 md:p-10 border border-[var(--border-color)] transition-all">
        <h2 className="text-2xl font-semibold text-[var(--text-heading)] mb-6 text-center">
          Verify Your Granted Access!!!
        </h2>
        <p className="text-[var(--color-bazaar-600)] text-sm mb-8">
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
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-[var(--border-color)] rounded-lg focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-bazaar-200)] outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-orange-400 hover:opacity-90 shadow-md transition"
          >
            Verify OTP
          </button>
        </form>
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-600">Didn’t receive the code?</p>

          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`w-full px-4 py-2 rounded-full font-semibold transition-all ${
              timer > 0
                ? "bg-[var(--color-bazaar-200)] text-[var(--color-bazaar-500)] cursor-not-allowed"
                : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-sm"
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
