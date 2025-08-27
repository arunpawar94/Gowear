import { Router } from "express";
import { showUsers, updateAdminStatus } from "../controllers/adminRole";

const router = Router();

router.get("/show_users", showUsers);
router.patch("/update_admin_status", updateAdminStatus);

export default router;
