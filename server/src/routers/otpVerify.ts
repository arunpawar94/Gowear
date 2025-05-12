import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otpVerification";

const router = express.Router();

router.post("/request", sendOtp);

router.post("/verify", verifyOtp);

export default router;
