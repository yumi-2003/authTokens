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

  //validation
  const validateInputField = (
    name: keyof FormState,
    value: string | boolean
  ): string | undefined => {
    switch (name) {
      case "name":
        if (!value || (value as string).trim() === "")
          return "Please fill your name!";
        if ((value as string).trim().length < 2)
          return "Name must be at least two characters";
        break;

      case "email":
        if (!value || (value as string).trim() === "")
          return "Please fill your email!";
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value as string))
          return "Invalid Email";
        break;

      case "password":
        if (!value || (value as string).trim() === "")
          return "Please fill your password";
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
            value as string
          )
        )
          return "Password must be at least 8 characters with uppercase, lowercase, number, and special characters";
        break;

      case "cpassword":
        if (!value || (value as string).trim() === "")
          return "Please fill your password";
        if ((value as string) !== formData.password)
          return "Password and confirm password do not match!";
        break;
    }
    return undefined;
  };

  const validateAllFields = (): boolean => {
    const newErrors: ErrorState = {
      name: validateInputField("name", formData.name),
      email: validateInputField("email", formData.email),
      password: validateInputField("password", formData.password),
      cpassword: validateInputField("cpassword", formData.password),
      role: validateInputField("role", formData.role),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  //handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAllFields()) {
      toast.error("Please fill all validate input fileds");
      return;
    }

    const result = await dispatch(registerUser(formData));
    // store email before resetting form
    const emailToVerify = formData.email;

    // reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      cpassword: "",
      role: "",
    });

    // if registration success, navigate to OTP page
    if (result.type.endsWith("/fulfilled")) {
      toast.success(
        "Registration successful! Verfiy your email, OTP has already sent to your email"
      );
      navigate("/verify-otp", { state: { email: emailToVerify } });
    } else {
      toast.error("Registration failed!Please try again");
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
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

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
          {errors.cpassword && (
            <p className="text-red-500 text-xs">{errors.cpassword}</p>
          )}

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
          {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}

          {/* terms and condition  */}
          <div className="flex flex-1 items-center gap-1 mt-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="whitespace-nowrap accent-[var(--color-accent)]"
            />
            <label
              htmlFor="terms"
              className="whitespace-nowrap text-sm text-[var(--text-body)] select-none leading-none"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-[var(--color-link)] hover:underline font-medium"
              >
                Terms & Conditions
              </Link>
            </label>
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
