import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  verifyOtp,
  googleLogin,
  resendOtp,
  logoutUser,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

//POST /api/auth/register
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/google", googleLogin);
//POST /api/auth/login
router.post("/login", loginUser);
//refresh token
router.post("/refresh", refreshAccessToken);
//POST /api/auth/logout
router.post("/logout", logoutUser);
//get /api/auth/me
router.get("/me", authMiddleware, getMe);
//post /api/auth/resend-otp
router.post("/resend-otp", resendOtp);
//post /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);
//post /api/auth/reset-password
router.post("/reset-password", resetPassword);

export default router;
