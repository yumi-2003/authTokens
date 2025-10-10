import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser } from "../features/auth/authThunks";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Eye, EyeOff, ChevronDown } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLoginButton";

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  //handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(registerUser(formData));

    // store email before resetting form
    const emailToVerify = formData.email;

    // reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      cpassword: "",
      role: "user",
    });

    // if registration success, navigate to OTP page
    if (result.type.endsWith("/fulfilled")) {
      navigate("/verify-otp", { state: { email: emailToVerify } });
    } else {
      console.error("Registration failed:", result);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-lg p-8 md:p-10 border border-[var(--border-color)] trasnsition-all">
        <h2 className="text-3xl font-bold text-center mb-6 text-[var(--color--bazaar-900)]">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-bazaar-500)]"
              size={18}
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 pr-10 rounded-md border border-[var(--border-color)] bg-white text-[var(--text-body)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-bazaar-200)] transition"
            />
          </div>

          <div className="relative">
            <Mail
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-bazaar-500)]"
              size={18}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 pr-10 rounded-md border border-[var(--border-color)] bg-white text-[var(--text-body)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-bazaar-200)] transition"
            />
          </div>
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 pr-10 rounded-md border border-[var(--border-color)] bg-white text-[var(--text-body)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-bazaar-200)] transition"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-bazaar-500)] cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showCPassword ? "text" : "password"}
              name="cpassword"
              placeholder="Confirm Password"
              value={formData.cpassword}
              onChange={handleChange}
              required
              className="w-full p-3 pr-10 rounded-md border border-[var(--border-color)] bg-white text-[var(--text-body)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-bazaar-200)] transition"
            />
            <div
              onClick={() => setShowCPassword(!showCPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-bazaar-500)] cursor-pointer"
            >
              {showCPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full appearance-none rounded-lg border border-[var(--border-color)] bg-white px-4 py-3 text-[var(--text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bazaar-200)] focus:border-[var(--color-accent)] transition cursor-pointer"
            >
              <option value="" disabled>
                Choose your role
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-bazaar-500)] pointer-events-none"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold py-3 rounded-full shadow-sm transition-all"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="flex items-center my-3">
            <div className="flex-grow h-px bg-[var(--border-color)]"></div>
            <span className="px-3 text-sm text-[var(--color-bazaar-500)]">
              or
            </span>
            <div className="flex-grow h-px bg-[var(--border-color)]"></div>
          </div>
          <GoogleLoginButton />
          {/* Login Text */}
          <p className="text-center text-sm text-[var(--text-body)] mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--color-link)] hover:text-[var(--color-link-hover)] font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
