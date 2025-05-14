import { Router, Request, Response, NextFunction } from "express";
import upload from "../config/multerConfig";
import { addProduct, getProducts } from "../controllers/product";
import {
  productValidator,
  validateImageFiles,
} from "../validators/productValidator";
import { validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware";
import authorizeRoles from "../middleware/authorizeRoles";

const router = Router();

router.post(
  "/add_product",
  authMiddleware,
  authorizeRoles("productManager", "admin"),
  upload.any(),
  productValidator,
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    let errorsArray = errors
      .array()
      .flatMap((item) => (Array.isArray(item.msg) ? item.msg : [item.msg]));
    if (!errors.isEmpty()) {
      res.status(400).json({ message: "Error", errors: errorsArray });
      return;
    }
    next();
  },
  validateImageFiles,
  addProduct
);

router.get("/show_products", getProducts);

export default router;
