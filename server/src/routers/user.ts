import { Router } from "express";
import {
  createUser,
  authenticateUser,
  refreshTokenController,
  logoutController,
} from "../controllers/user";

const router = Router();

router.post("/register", createUser);
router.post("/login", authenticateUser);
router.post("/refresh_token", refreshTokenController);
router.post("/logout", logoutController);

export default router;
