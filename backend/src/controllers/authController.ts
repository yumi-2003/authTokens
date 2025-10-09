import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import Otp from "../models/Otp";
import { sentOtpEmail } from "../config/nodemailer";
import admin from "../config/firebase";
import jwt from "jsonwebtoken";
const validator = require("validator");

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

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
      isVerified: false,
    });
    await newUser.save();

    // Generate OTP (6 digits)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const otpDoc = new Otp({
      userId: newUser._id,
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
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

// LOGIN USER
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.password)
      return res.status(400).json({ message: "Google login only" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role, user.name);

    res.status(200).json({
      message: "Login successful",
      token,
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

// VALIDATE TOKEN (/me)
export const getMe = (req: any, res: Response) => {
  res.status(200).json({
    message: "Token valid",
    user: req.user,
  });
};

// google login firebase
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: decodedToken.uid,
        isVerified: true,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.json({ message: "Google Login Successful", token, user });
  } catch (error) {
    console.log("Google login error: ", error);
    res.json({ message: "Invalid Google token" });
  }
};
