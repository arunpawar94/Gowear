import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import userRoutes from "./routers/user";
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
    origin: reactAppUrl, // your frontend URL
    credentials: true, // ALLOW COOKIES TO BE SENT
  })
);

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/otp_verify", otpVerify);
app.get("/verifyUser", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "access granted" });
});
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({ message: "Unexpected server error", error: err.message });
});
app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
