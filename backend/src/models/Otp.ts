import mongoose, { Document, Schema } from "mongoose";

export interface IOtp extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// automatically delete OTPs after expiry (TTL index)
// OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
