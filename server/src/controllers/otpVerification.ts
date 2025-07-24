import OTPModel from "../models/otpModel";
import userModel from "../models/userModel";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import axios from "axios";

const BrevoAPIKey = process.env.BREVO_API_KEY!;

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const record = await OTPModel.findOne({ email });
  const regRecord = await userModel.findOne({ email });
  if (!regRecord) {
    res.status(400).json({ message: "error", error: "User not registered." });
    return;
  }
  if (record) {
    await OTPModel.deleteOne({ _id: record._id });
  }
  try {
    await OTPModel.create({ email, otp: hashedOtp });
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Gowear", email: "arunpawar94@gmail.com" },
        to: [{ email: email, name: regRecord.name }],
        subject: "Otp to verify email",
        text: `Please verify Your OTP is ${otp}. It will expire in 5 minutes.`,
        htmlContent: `<span>
            Hello,
            <br/><br/>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:
            <br/><br/>OTP: <b>${otp}</b>
            <br/><br/>This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.
            <br/><br/>Best regards,  
            <br/><br/>Gowear Support Team
          </span>`,
      },
      {
        headers: {
          "api-key": BrevoAPIKey,
          "Content-Type": "application/json",
        },
      }
    );
    res
      .status(200)
      .json({ message: "success", data: "OTP sent successfully." });
  } catch (err: any) {
    res.status(500).json({ message: "error", error: "Something went wrong" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const record = await OTPModel.findOne({ email });
  if (!email || !otp) {
    res.status(400).json({
      message: "error",
      error: "Email and otp are required",
      body: req.body,
    });
    return;
  }
  if (!record) {
    res
      .status(400)
      .json({ message: "error", error: "OTP expired or invalid OTP" });
    return;
  }
  const isValid = await bcrypt.compare(otp, record.otp);
  if (!isValid) {
    res.status(400).json({ message: "error", error: "Invalid OTP" });
    return;
  }
  await userModel.updateOne({ email }, { $set: { emailVerified: true } });
  await OTPModel.deleteOne({ _id: record._id });
  res
    .status(200)
    .json({ message: "success", data: "OTP verified successfully." });
};
