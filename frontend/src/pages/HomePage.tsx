// import React from "react";
import { Link } from "react-router-dom";
import { UserPlus, Lock, ShieldCheck } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-(--bg-body) px-4">
      {/* Main container */}
      <div className="max-w-4xl w-full bg-(--bg-card) rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all">
        {/* Left side: icon illustration */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-8 bg-(--color-accent) text-white">
          <ShieldCheck className="w-28 h-28 mb-6" />
          <h1 className="text-4xl font-bold mb-4">Secure Authentication</h1>
          <p className="text-lg text-(--color-bazaar-50) text-center">
            Protect your account with strong security including reCAPTCHA and
            OTP verification.
          </p>
        </div>

        {/* Right side: login/register actions */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-8 space-y-6 bg-(--bg-card)">
          <h2 className="text-3xl font-semibold text-(--text-body)">
            Welcome Back!
          </h2>
          <p className="text-(--color-bazaar-600) text-center">
            Please login or register to access your dashboard.
          </p>

          {/* Login Button */}
          <Link
            to="/login"
            style={{ color: "white" }}
            className="w-full flex items-center justify-center bg-(--color-accent) font-semibold py-3 rounded-lg shadow-md transition transform hover:scale-105"
          >
            <Lock className="mr-2" size={20} />
            Login
          </Link>

          {/* Register Button */}
          <Link
            to="/signup"
            className="w-full flex items-center justify-center border-2 border-(--color-accent) hover:border-(--color-accent-hover) text-(--color-accent) hover:text-(--color-accent-hover) font-semibold py-3 rounded-lg shadow-md transition transform hover:scale-105"
          >
            <UserPlus className="mr-2" size={20} />
            Register
          </Link>

          {/* Optional Info */}
          <p className="text-(--color-bazaar-600) text-sm mt-6 text-center">
            Your data is protected with advanced security measures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
