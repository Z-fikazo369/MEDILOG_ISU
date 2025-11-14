// server/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    lrn: { type: String, required: true },
    studentId: { type: String, required: true },
    profilePictureUrl: { type: String, default: "" },
    idPictureUrl: { type: String, default: "" }, // Para sa verification

    // ✅ --- MGA BAGONG FIELDS --- ✅
    department: { type: String },
    program: { type: String },
    yearLevel: { type: String },
    // ✅ -------------------------- ✅

    role: { type: String, enum: ["student", "admin"], default: "student" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    defaultLoginMethod: {
      type: String,
      enum: ["email", "studentId"],
      default: "email",
    },
    isVerified: { type: Boolean, default: false },
    firstLoginCompleted: { type: Boolean, default: false },
    rememberMe: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
