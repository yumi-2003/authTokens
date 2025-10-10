import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  verifyOtp,
  googleLogin,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

//POST /api/auth/register
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/google", googleLogin);
//POST /api/auth/login
router.post("/login", loginUser);
//get /api/auth/me
router.get("/me", authMiddleware, getMe);

export default router;
