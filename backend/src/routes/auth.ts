import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  verifyOtp,
  googleLogin,
  resendOtp,
  logoutUser,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

//POST /api/auth/register
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/google", googleLogin);
//POST /api/auth/login
router.post("/login", loginUser);
//POST /api/auth/logout
router.post("/logout", logoutUser);
//get /api/auth/me
router.get("/me", authMiddleware, getMe);
//post /api/auth/resend-otp
router.post("/resend-otp", resendOtp);

export default router;
