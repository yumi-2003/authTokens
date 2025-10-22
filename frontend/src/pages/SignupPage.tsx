import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser } from "../features/auth/authThunks";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Eye, EyeOff, ChevronDown } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { toast } from "react-toastify";

interface FormState {
  name: string;
  email: string;
  password: string;
  cpassword: string;
  role: string;
}

interface ErrorState {
  name?: string;
  email?: string;
  password?: string;
  cpassword?: string;
  role?: string;
}

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation function
  const validateInputField = (
    name: keyof FormState,
    value: string | boolean
  ) => {
    switch (name) {
      case "name":
        if (!value || (value as string).trim() === "")
          return "Please fill your name!";
        if ((value as string).trim().length < 2)
          return "Name must be at least 2 characters";
        break;
      case "email":
        if (!value || (value as string).trim() === "")
          return "Please fill your email!";
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value as string))
          return "Invalid email";
        break;
      case "password":
        if (!value || (value as string).trim() === "")
          return "Please fill your password!";
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
            value as string
          )
        )
          return "Password must be 8+ chars with uppercase, lowercase, number & special char";
        break;
      case "cpassword":
        if (!value || (value as string).trim() === "")
          return "Please confirm your password!";
        if (value !== formData.password) return "Passwords do not match!";
        break;
      case "role":
        if (!value) return "Please select a role!";
        break;
    }
    return undefined;
  };

  const validateAllFields = (): boolean => {
    const newErrors: ErrorState = {
      name: validateInputField("name", formData.name),
      email: validateInputField("email", formData.email),
      password: validateInputField("password", formData.password),
      cpassword: validateInputField("cpassword", formData.cpassword),
      role: validateInputField("role", formData.role),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      toast.error("Please fill all fields correctly");
      return;
    }

    if (!agreeTerms) {
      toast.error("You must agree to the Terms & Conditions");
      return;
    }

    const result = await dispatch(registerUser(formData));
    const emailToVerify = formData.email;

    setFormData({
      name: "",
      email: "",
      password: "",
      cpassword: "",
      role: "",
    });

    if (result.type.endsWith("/fulfilled")) {
      toast.success("Registration successful! Please login to continue.");
      setTimeout(() => {
        navigate("/login", { state: { email: emailToVerify } });
      }, 1500);
    } else {
      toast.error("Registration failed! Please try again.");
      console.error("Registration failed:", result);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-body) px-4">
      <div className="w-full max-w-md bg-(--bg-card) rounded-2xl shadow-lg p-8 md:p-10 border border-(--border-color) transition-all">
        <h2 className="text-3xl font-bold text-center mb-6 text-(--color--bazaar-900)">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div className="relative">
            <User
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-bazaar-500)"
              size={18}
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 pr-10 rounded-md border border-(--border-color) bg-white text-(--text-body) focus:outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-bazaar-200) transition"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-bazaar-500)"
              size={18}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 pr-10 rounded-md border border-(--border-color) bg-white text-(--text-body) focus:outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-bazaar-200) transition"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pr-10 rounded-md border border-(--border-color) bg-white text-(--text-body) focus:outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-bazaar-200) transition"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-bazaar-500) cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showCPassword ? "text" : "password"}
              name="cpassword"
              placeholder="Confirm Password"
              value={formData.cpassword}
              onChange={handleChange}
              className="w-full p-3 pr-10 rounded-md border border-(--border-color) bg-white text-(--text-body) focus:outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-bazaar-200) transition"
            />
            <div
              onClick={() => setShowCPassword(!showCPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-bazaar-500) cursor-pointer"
            >
              {showCPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
          {errors.cpassword && (
            <p className="text-red-500 text-xs">{errors.cpassword}</p>
          )}

          {/* Role */}
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full appearance-none rounded-lg border border-(--border-color) bg-white px-4 py-3 text-(--text-body) focus:outline-none focus:ring-2 focus:ring-(--color-bazaar-200) focus:border-(--color-accent) transition cursor-pointer"
            >
              <option value="" disabled>
                Choose your role
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-bazaar-500) pointer-events-none"
            />
          </div>
          {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}

          {/* Terms */}
          <div className="flex items-center gap-1 mt-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="accent-(--color-accent)"
            />
            <label
              htmlFor="terms"
              className="text-sm text-(--text-body) select-none"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-(--color-link) hover:underline font-medium"
              >
                Terms & Conditions
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--color-accent) hover:bg-(--color-accent-hover) text-white font-semibold py-3 rounded-full shadow-sm transition-all"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="flex items-center my-3">
            <div className="grow h-px bg-(--border-color)"></div>
            <span className="px-3 text-sm text-(--color-bazaar-500)">or</span>
            <div className="grow h-px bg-(--border-color)"></div>
          </div>

          <GoogleLoginButton />

          <p className="text-center text-sm text-(--text-body) mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-(--color-link) hover:text-(--color-link-hover) font-medium"
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
