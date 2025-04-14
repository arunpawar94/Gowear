import express, { Request, Response, NextFunction } from "express";
import connectDB from "./config/db";
import userRoutes from "./routers/user";
import productRoutes from "./routers/product";

const app = express();

app.use(express.json());

connectDB();

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({ message: "Unexpected server error", error: err.message });
});
app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
