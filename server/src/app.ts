import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import userRoutes from "./routers/user";
import adminRoutes from "./routers/admin";
import productRoutes from "./routers/product";
import otpVerify from "./routers/otpVerify";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware";
import authorizeRoles from "./middleware/authorizeRoles";

const reactAppUrl = process.env.REACT_APP_URL!;

const app = express();
app.use(cookieParser());
app.use(express.json());

connectDB();

app.use(
  cors({
    origin: reactAppUrl,
    credentials: true,
  })
);

app.use("/admin", authMiddleware, authorizeRoles("admin"), adminRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/otp_verify", otpVerify);
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "error", error: "Route not found." });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: "error", error: err.message });
});
app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
