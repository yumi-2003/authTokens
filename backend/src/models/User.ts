// src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: "user" | "admin";
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
