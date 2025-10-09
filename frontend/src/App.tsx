import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
// import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
      <Route path="/verify-otp" element={<OtpPage />} />
    </Routes>
  );
}

export default App;
