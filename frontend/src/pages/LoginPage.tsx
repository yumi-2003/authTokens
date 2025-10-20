import { useState, useRef } from "react";
import { Mail, EyeOff, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser } from "../features/auth/authThunks";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

  // Validate email/password
  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Please fill your email!";
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value))
          return "Invalid Email (only Gmail allowed)";
        return null;
      case "password":
        if (!value.trim()) return "Please fill your password!";
        return null;
      default:
        return null;
    }
  };

  // Login submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (emailError) return toast.error(emailError);
    if (passwordError) return toast.error(passwordError);

    const result = await dispatch(
      loginUser({ email, password, recaptchaToken })
    );

    if (loginUser.fulfilled.match(result)) {
      toast.success("Login successful!");
      setRecaptchaToken("");
      setShowCaptcha(false);
      setCaptchaVerified(false);

      const loggedInUser = result.payload?.user;
      setTimeout(() => {
        if (loggedInUser?.role === "admin") navigate("/dashboard/admin");
        else navigate("/dashboard/user");
      }, 500);
    } else {
      const msg = result.payload as string;
      toast.error(msg);

      if (
        msg === "reCAPTCHA required" ||
        msg === "reCAPTCHA verification failed"
      ) {
        setShowCaptcha(true);
        recaptchaRef.current?.reset();
        setRecaptchaToken("");
        setCaptchaVerified(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
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

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* ReCAPTCHA */}
          {showCaptcha && (
            <div className="mt-4">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                ref={recaptchaRef}
                onChange={(token) => {
                  if (token) {
                    setRecaptchaToken(token);
                    setCaptchaVerified(true);
                  }
                }}
              />
            </div>
          )}

          {/* Forgot Password link shown only after captcha verified */}
          {captchaVerified && (
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* OR separator */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Signup link */}
        <Link
          to="/signup"
          className="block text-center text-blue-500 hover:underline mt-4"
        >
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
