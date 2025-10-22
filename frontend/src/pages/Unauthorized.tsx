import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-(--bg-body) text-(--text-body)">
      <div className="bg-(--bg-card) p-8 rounded-xl shadow-lg text-center max-w-md">
        <ShieldOff className="text-(--color-accent) mx-auto mb-4" size={40} />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-sm text-gray-500 mb-6">
          You don’t have permission to view this page.
        </p>
        <Link
          to="/login"
          className="text-(--color-accent) font-semibold hover:underline"
        >
          Go Back to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
