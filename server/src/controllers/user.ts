import { Request, Response } from "express";
import User from "../models/userModel";
import { generateAccessToken, verifyRefreshToken } from "../utils/jwtToken";
import { Types } from "mongoose";
import {
  createNewUser,
  authenticateExistingUser,
} from "../services/authService";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      role,
      methodToSignUpLogin,
      termsAndPolicies,
    } = req.body;
    const rawData = {
      profileImage: {
        imgUrl: "",
        publicId: "",
      },
      dateOfBirth: "",
      emailVerified: false,
      accountVerified: role === "user",
    };
    const newUser = await createNewUser({
      ...rawData,
      name,
      email,
      password,
      role,
      methodToSignUpLogin,
      termsAndPolicies,
    });
    res.status(201).json({ message: "success", data: newUser });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "ValidationError") {
        const errorArray = err.message.split(",").map((e) => e.trim());
        res.status(400).json({ message: "error", errors: errorArray });
      }
      if (err.name === "UserExistsError") {
        res.status(400).json({ message: "error", errors: err.message });
      }
    } else {
      res.status(500).json({
        message: "error",
        errors: [err instanceof Error ? err.message : "Unknown server error"],
      });
    }
  }
};

export const authenticateUser = async (
  request: Request,
  response: Response
) => {
  const { email, password, keepMeLoggedIn, methodToSignUpLogin } = request.body;

  const loginCredential = {
    email,
    password,
    keepMeLoggedIn,
    methodToSignUpLogin,
  };

  authenticateExistingUser(loginCredential)
    .then((authResponse) => {
      response.cookie("refreshToken", authResponse.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge:
          keepMeLoggedIn === true
            ? 7 * 24 * 60 * 60 * 1000
            : 12 * 60 * 60 * 1000, // 7 days or 12 hours
      });
      response.json({
        message: "success",
        data: { user: authResponse.user, token: authResponse.accessToken },
      });
    })
    .catch((errors: unknown) => {
      if (errors instanceof Error) {
        response.status(400).json({ message: "error", error: errors.message });
      } else {
        response.status(500).json({
          message: "error",
          errors: [
            errors instanceof Error ? errors.message : "Unknown server error",
          ],
        });
      }
    });
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json({ message: "error", error: "No refresh token" });
    return;
  }
  try {
    const decoded = verifyRefreshToken(token) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "error", error: "User not found" });
      return;
    }
    const newAccessToken = generateAccessToken(
      (user._id as Types.ObjectId).toString(),
      user.role
    );
    res.json({ message: "success", token: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "error", error: "Invalid refresh token" });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  const userData = req.user;
  if (userData) {
    const userInfo = {
      _id: userData._id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      profileImage: userData.profileImage,
    };
    res.status(200).json({
      message: "success",
      data: userInfo,
    });
  } else {
    res.status(401).json({ message: "error", error: "User not found" });
  }
};
