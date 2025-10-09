import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import Otp from "../models/Otp";
import { sentOtpEmail } from "../config/nodemailer";
import admin from "../config/firebase";
import jwt from "jsonwebtoken";
const validator = require("validator");

// REGISTER USER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    //check user aleardy exist
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    //generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = new Otp({
      userId: newUser._id,
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    await otp.save();
    // send OTP email
    await sentOtpEmail(email, otpCode);
    const token = generateToken(newUser._id, newUser.role, newUser.name);
    res.status(201).json({
      message: "User registered successfully, OTP sent to email",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otpCode } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const otpSave = await Otp.findOne({
      userId: user._id,
      code: otpCode,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (!otpSave) {
      return res.status(400).json({ message: "Invalid or expried OTP" });
    }
    otpSave.used = true;
    await otpSave.save();
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Sever error" });
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
