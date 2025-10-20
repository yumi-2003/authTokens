import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import Otp from "../models/Otp";
import { sentOtpEmail } from "../config/nodemailer";
import admin from "../config/firebase";
import jwt from "jsonwebtoken";
import { generateRefreshToken, hashRefreshToken } from "../utils/refreshToken";
import { RefreshTokenModel } from "../models/RefreshToken";
const validator = require("validator");

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

// register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email address" });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({ message: "Password is not strong enough" });

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user first
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
    });
    await newUser.save();

    // Generate OTP (6 digits)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const otpDoc = new Otp({
      userId: newUser._id,
      code: otpCode,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000), // 1 minute
    });
    await otpDoc.save();

    // Send OTP email
    await sentOtpEmail(email, otpCode);

    return res
      .status(201)
      .json({ message: "User registered. OTP sent to email.", email });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpDoc = await Otp.findOne({
      userId: user._id,
      code: otp,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    await otpDoc?.save();

    if (!otpDoc)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // Mark OTP used and user verified
    otpDoc.used = true;
    await otpDoc.save();

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, recaptchaToken } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    // check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // require reCAPTCHA after 3 failed attempts
    if ((user.loginAttempts || 0) >= 3) {
      if (!recaptchaToken)
        return res.status(400).json({ message: "reCAPTCHA required" });

      const secretKey = process.env.RECAPTCHA_SECRET_KEY!;
      const params = new URLSearchParams();
      params.append("secret", secretKey);
      params.append("response", recaptchaToken);

      const response = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          body: params,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const data = (await response.json()) as RecaptchaResponse;

      if (!data.success)
        return res
          .status(400)
          .json({ message: "reCAPTCHA verification failed" });
    }

    // check email verification
    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first" });

    // check password exists
    if (!user.password)
      return res
        .status(400)
        .json({ message: "Please use Google login for this account" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      await user.save();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // reset loginAttempts on successful login
    user.loginAttempts = 0;
    await user.save();

    // generate access token
    const accessToken = generateToken(user._id, user.role, user.name);

    // generate refresh token
    const { refreshToken, hashedToken } = generateRefreshToken();
    await RefreshTokenModel.create({
      userId: user._id,
      tokenHashed: hashedToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // send refresh token via HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // send access token
    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//refresh token
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const hashed = hashRefreshToken(token);
    const storedToken = await RefreshTokenModel.findOne({
      tokenHashed: hashed,
    });
    if (!storedToken || storedToken.expiresAt < new Date())
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });

    const user = await User.findById(storedToken.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = generateToken(user._id, user.role, user.name);

    // rotate refresh token
    await RefreshTokenModel.deleteOne({ tokenHashed: hashed });
    const { refreshToken: newRefresh, hashedToken: newHash } =
      generateRefreshToken();
    await RefreshTokenModel.create({
      userId: user._id,
      tokenHashed: newHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// VALIDATE TOKEN (/me)
export const getMe = (req: any, res: Response) => {
  res.status(200).json({
    message: "Token valid",
    user: req.user,
  });
};

// get user infor which is aleready authenticated
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log("Profile fetach error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// google login firebase
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "Missiong ID token" });

    //verfiy token from firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    let user = await User.findOne({ email });
    if (!user) {
      //new google signup
      user = await User.create({
        name,
        email,
        googleId: decodedToken.uid,
        isVerified: true,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Google authentication Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Google login error: ", error);
    res.json({ message: "Invalid Google token" });
  }
};

//resent otp
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });
    //delte old opts for this user
    await Otp.deleteMany({ userId: user._id });
    //generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    //save opt with 10 min expiry
    const otpDoc = new Otp({
      userId: user._id,
      code: otpCode,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000), // 1 mins expires
    });
    await otpDoc.save();
    //send via email
    await sentOtpEmail(email, otpCode);
    res.status(200).json({
      message: "New OTP sent to your emaial. it will exprie in 1 min",
    });
  } catch (error) {
    console.log("Resend OTP error", error);
    res.status(500).json({ message: "Sever error" });
  }
};

//logout User
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const hashed = hashRefreshToken(token);
      await RefreshTokenModel.deleteOne({ tokenHashed: hashed });
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Logout error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// verfiy repcatcha verification
const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY!;
  const params = new URLSearchParams();
  params.append("secret", secretKey);
  params.append("response", token);

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    { method: "POST", body: params }
  );
  const data = (await response.json()) as RecaptchaResponse;
  return data.success;
};

//forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, captchaToken } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!captchaToken)
      return res.status(400).json({ message: "reCAPTCHA is required" });

    const isCaptchaValid = await verifyRecaptcha(captchaToken);
    if (!isCaptchaValid)
      return res.status(400).json({ message: "reCAPTCHA verification failed" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete old OTPs for this user
    await Otp.deleteMany({ userId: user._id });

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    const otpDoc = new Otp({
      userId: user._id,
      code: otpCode,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });
    await otpDoc.save();

    // Send OTP via email
    await sentOtpEmail(email, otpCode);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Forgot Password error", error);
    res.status(500).json({ message: "Server error" });
  }
};

//reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are requried" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const otpDoc = await Otp.findOne({
      userId: user._id,
      code: otp,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (!otpDoc)
      return res.status(400).json({ message: "Invalid or expried OTP" });
    //update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    //Mark OTP as sued
    otpDoc.used = true;
    await otpDoc.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset passwrod error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
