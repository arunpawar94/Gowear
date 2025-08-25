import { Router } from "express";
import {
  createUser,
  authenticateUser,
  refreshTokenController,
  getUserInfo,
  logoutController,
} from "../controllers/user";
import { showUsers } from "../controllers/adminRole";
import authMiddleware from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/authorizeRoles";

import { googleLogin } from "../controllers/socialAuthantcation";

const router = Router();

router.post("/register", createUser);
router.post("/login", authenticateUser);
router.post("/log_out", logoutController);
router.post("/refresh_token", refreshTokenController);
router.post("/auth/google", googleLogin);
router.get("/get_user_info", authMiddleware, getUserInfo);
router.get("/show_users", authMiddleware, authorizeRoles("admin"), showUsers);

export default router;
