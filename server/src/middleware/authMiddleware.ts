import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel";
import { Document } from "mongoose";
import { verifyAccessToken } from "../utils/jwtToken";

// Extend the Request interface to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: Document<unknown, {}, IUser> & IUser;
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

export default authMiddleware;
