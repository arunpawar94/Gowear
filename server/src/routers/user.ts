import { Router } from "express";
import {
  createUser,
  authenticateUser,
  refreshTokenController,
  getUserInfo
} from "../controllers/user";
import authMiddleware from "../middleware/authMiddleware"

import { googleLogin } from "../controllers/socialAuthantcation";

const router = Router();

router.post("/register", createUser);
router.post("/login", authenticateUser);
router.post("/refresh_token", refreshTokenController);
router.post("/auth/google", googleLogin);
router.get("/get_user_info", authMiddleware, getUserInfo);

export default router;
