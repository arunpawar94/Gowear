import { Request, Response, NextFunction } from "express";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      res
        .status(401)
        .json({ message: "error", error: "Unauthorized - no user found" });
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "error", error: "Not authorized." });
      return;
    }
    next();
  };
};

export default authorizeRoles;
