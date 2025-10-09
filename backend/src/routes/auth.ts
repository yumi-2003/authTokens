import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

//POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fileds are required" });
    }

    //check if user aleary exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is in used" });
    }

    //hash password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registration successful!!!",
      user: { id: newUser._id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ---- login //POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    //find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid crendentials" });
    }
    //generate JWT token
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
});

//verify token
router.get("/me", authMiddleware, (req, res) => {
  //authmiddlewrae verifies JWT and adds user info to req.user
  res.json({
    message: "Token valid",
    user: (req as any).user, // contain decoded token data
  });
});
export default router;
