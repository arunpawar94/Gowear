import { Router } from "express";
import {
  createUser,
  authenticateUser,
  refreshTokenController,
  logoutController,
} from "../controllers/user";

import { googleLogin } from "../controllers/socialAuthantcation";

const router = Router();

router.post("/register", createUser);
router.post("/login", authenticateUser);
router.post("/refresh_token", refreshTokenController);
router.post("/logout", logoutController);
router.post("/auth/google", googleLogin);

export default router;
