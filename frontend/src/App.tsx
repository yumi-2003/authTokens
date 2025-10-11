import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserDashboard from "./pages/Dashboards/UserDashboard";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoutes from "./components/ProtectedRoutes";
import OtpPage from "./pages/OtpPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Role Protected Routes */}
      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoutes allowedRoles={["user", "admin"]}>
            <UserDashboard />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoutes allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoutes>
        }
      />

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Default fallback */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
