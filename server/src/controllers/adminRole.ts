import { Request, Response } from "express";
import Users from "../models/userModel";
import isNaturalNumberString from "../utils/checkIsNaturalNumberString";
import checkValidValue from "../utils/checkValidValue";
import userModel from "../models/userModel";
import mongoose from "mongoose";
import checkValidAndExistIds from "../services/checkValidAndExistIds";

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

export const updateAdminStatus = async (
  requiest: Request,
  response: Response
) => {
  const { userIds, status: statusToChange } = requiest.body;
  if (!userIds) {
    response
      .status(400)
      .json({ message: "error", error: "User's ID is required." });
    return;
  }
  const isValidStatus = checkValidValue(
    [statusToChange],
    ["pending", "approved", "rejected"]
  );
  if (!isValidStatus) {
    response.status(400).json({
      message: "error",
      error: "Invalid status value.",
    });
    return;
  }
  try {
    if (typeof userIds === "string") {
      if (!mongoose.Types.ObjectId.isValid(userIds)) {
        response
          .status(400)
          .json({ message: "error", error: "Invalid userId format." });
        return;
      }
      const getUser = await userModel.findById(userIds, {
        adminVerification: 1,
      });
      if (getUser) {
        if (getUser.adminVerification === statusToChange) {
          response.status(404).json({
            message: "error",
            error: `Admin status is already ${statusToChange}`,
          });
          return;
        } else {
          await userModel.findByIdAndUpdate(
            userIds,
            { $set: { adminVerification: statusToChange } },
            { new: true }
          );
        }
      } else {
        response
          .status(404)
          .json({ message: "error", error: "User not exist." });
        return;
      }
      response.status(200).json({
        message: "success",
        data: "Admin status updated successfully",
      });
      return;
    }
    if (Array.isArray(userIds)) {
      if (userIds.length === 0) {
        response
          .status(400)
          .json({ message: "error", error: "User's ID is required." });
        return;
      }
      const {
        invalidIds,
        validIds,
        validIdsCount,
        existingDocsCount,
        existingDocs,
      } = await checkValidAndExistIds(userIds, userModel);
      if (validIdsCount === 0) {
        response
          .status(400)
          .json({ message: "error", error: "None of the user ID is valid." });
        return;
      }
      if (existingDocsCount === 0) {
        response
          .status(400)
          .json({ message: "error", error: "None of the user is exist." });
        return;
      }
      const existingUsers = existingDocs.map((item) => item["_id"]);
      const result = await userModel.updateMany(
        { _id: { $in: validIds } },
        { $set: { adminVerification: statusToChange } }
      );
      response.status(200).json({
        message: "success",
        data: "Admin status updated successfully",
        meta: {
          requestedCount: userIds.length,
          modifiedCount: result.modifiedCount,
          existingUsers: existingUsers,
          invalidUserIds: invalidIds,
        },
      });
      return;
    }
  } catch (_errors) {
    response.status(500).json({
      message: "error",
      error: "Server error, Unable to update status.",
    });
    return;
  }
};

export const deleteUsers = async (requiest: Request, response: Response) => {
  const { userIds } = requiest.body;
  if (!userIds) {
    response
      .status(400)
      .json({ message: "error", error: "User's ID is required." });
    return;
  }
  try {
    if (typeof userIds === "string") {
      if (!mongoose.Types.ObjectId.isValid(userIds)) {
        response
          .status(400)
          .json({ message: "error", error: "Invalid userId format." });
        return;
      }
      const getUser = await userModel.findById(userIds, "_id");
      if (getUser) {
        await userModel.findByIdAndDelete(userIds);
      } else {
        response
          .status(404)
          .json({ message: "error", error: "User not exist." });
        return;
      }
      response.status(200).json({
        message: "success",
        data: "Account deleted successfully!",
      });
      return;
    }
    if (Array.isArray(userIds)) {
      if (userIds.length === 0) {
        response
          .status(400)
          .json({ message: "error", error: "User's ID is required." });
        return;
      }
      const {
        invalidIds,
        validIds,
        validIdsCount,
        existingDocsCount,
        existingDocs,
      } = await checkValidAndExistIds(userIds, userModel);
      if (validIdsCount === 0) {
        response
          .status(400)
          .json({ message: "error", error: "None of the user ID is valid." });
        return;
      }
      if (existingDocsCount === 0) {
        response
          .status(400)
          .json({ message: "error", error: "None of the user is exist." });
        return;
      }
      const existingUsers = existingDocs.map((item) => item["_id"]);
      const result = await userModel.deleteMany({ _id: { $in: validIds } });
      response.status(200).json({
        message: "success",
        data: "Accounts deleted successfully",
        meta: {
          requestedCount: userIds.length,
          deletedCount: result.deletedCount,
          deletedUsers: existingUsers,
          invalidUserIds: invalidIds,
        },
      });
      return;
    }
  } catch (_errors) {
    response.status(500).json({
      message: "error",
      error: "Server error, Unable to update status.",
    });
    return;
  }
};
