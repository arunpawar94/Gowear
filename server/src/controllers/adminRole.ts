import { Request, Response } from "express";
import Users from "../models/userModel";
import isNaturalNumberString from "../utils/checkIsNaturalNumberString";

interface UsersFilter {
  role?: { $in: RegExp[] };
  emailVerified?: boolean;
  adminVerification?: { $in: RegExp[] };
}

export const showUsers = async (requiest: Request, response: Response) => {
  let { page, per_page, role, emailVerified, adminVerification } =
    requiest.query;
  const errors: string[] = [];
  if (page && !isNaturalNumberString(page as string)) {
    errors.push("Invalid page no.");
  }
  if (per_page && !isNaturalNumberString(per_page as string)) {
    errors.push("Invalid per page count.");
  }
  if (errors.length > 0) {
    response.status(400).json({ message: "error", errors });
    return;
  }
  try {
    const pageNum = parseInt(page as string) || 1;
    const limit = parseInt(per_page as string) || 10;
    const skip = (pageNum - 1) * limit;
    const filters: UsersFilter = {};

    if (typeof role === "string") {
      const roles = role.split(",").map((r) => r.toLowerCase().trim());
      filters.role = {
        $in: roles.map((r) => new RegExp(`^${r}$`, "i")),
      };
    }

    if (emailVerified && typeof emailVerified === "string") {
      filters.emailVerified = emailVerified.toLowerCase() === "true";
    }

    if (typeof adminVerification === "string") {
      const adminVerifications = adminVerification
        .split(",")
        .map((r) => r.toLowerCase().trim());
      filters.adminVerification = {
        $in: adminVerifications.map((r) => new RegExp(`^${r}$`, "i")),
      };
    }

    const users = await Users.find(
      filters,
      "name email role emailVerified adminVerification"
    )
      .skip(skip)
      .limit(limit);
    const totalCount = await Users.countDocuments(filters);
    const meta = {
      total: totalCount,
      page: pageNum,
      per_page: limit,
      total_pages: Math.ceil(totalCount / limit),
    };
    response.status(200).json({ message: "success", data: users, meta });
  } catch (error) {
    response.status(400).json({ message: "error", error: error });
  }
};
