import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { forgotPassword } from "../features/auth/authThunks";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const dispatch = useAppDispatch();
  const { loading, message, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warn("Please enter your email address");
      return;
    }
    if (!captchaToken) {
      toast.warn("Please complete the reCAPTCHA");
      return;
    }

    dispatch(forgotPassword({ email, captchaToken }));

    setTimeout(() => {
      navigate("/reset-password", { state: { email } });
    }, 1500);
  };

  useEffect(() => {
    if (message) toast.success(message);
    if (error) toast.error(error);
  }, [message, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="relative">
            <Mail
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* ReCAPTCHA */}
          <div className="mt-4">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              ref={recaptchaRef}
              onChange={(token) => {
                if (token) setCaptchaToken(token);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
