import React, { useState } from "react";
import { Mail, EyeOff, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser } from "../features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] px-4">
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-lg p-8 md:p-10 border border-[var(--border-color)] transition-all">
        <h2 className="text-2xl font-semibold text-[var(--text-heading)] mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full pl-10 p-3 rounded-lg border border-[var(--border-color)] bg-white text-[var(--text-body)] focus:outline-none focus:border[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-bazaar-200)] transition"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-[var(--border-color)]"></div>
          <span className="px-3 text-sm text-[var(--color-bazaar-500)]">
            or
          </span>
          <div className="flex-grow h-px bg-[var(--border-color)]"></div>
        </div>
        <GoogleLoginButton />
        <p
          onClick={() => navigate("register")}
          className="text-center text-sm mt-6 text-[var(--color-bazaar-600)] cursor-pointer hover:text[var(--color-accent)] transition"
        >
          Don't have an account?{" "}
          <span className="font-semibold text-[var(--color-accent)] hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
