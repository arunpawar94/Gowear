import { Router } from "express";
import {
  deleteUsers,
  showUsers,
  updateAdminStatus,
} from "../controllers/adminRole";

const router = Router();

router.get("/show_users", showUsers);
router.patch("/update_admin_status", updateAdminStatus);
router.delete("/delete_users", deleteUsers);

export default router;
