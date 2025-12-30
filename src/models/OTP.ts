import mongoose, { Document } from "mongoose";

export interface IOtp extends Document{
    email: string
    otp: string
    expiresAt: Date
}

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

export const OtpModel = mongoose.model("OTP", otpSchema);
