import { Request, Response } from "express";
import User from "../models/userModel";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtToken";
import { Types } from "mongoose";

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
    const newUser = new User({
      ...rawData,
      name,
      email,
      password,
      role,
      methodToSignUpLogin,
      termsAndPolicies,
    });
    await newUser.save();
    res.status(201).json({ message: "success", data: newUser });
  } catch (errors: any) {
    if (errors.name === "ValidationError") {
      const UpdateError: Record<string, string> = {};
      for (const key in errors.errors) {
        UpdateError[key] = errors.errors[key].message;
      }
      let errorArray = Object.values(UpdateError);
      res.status(400).json({ message: "error", errors: errorArray });
    } else {
      if (errors.code === 11000 && errors.keyValue.email) {
        res
          .status(400)
          .json({ message: "error", errors: "Email already exists." });
      } else {
        res.status(400).json({ message: "error", errors });
      }
    }
  }
};

export const authenticateUser = async (
  request: Request,
  response: Response
) => {
  const { email, password, keepMeLoggedIn } = request.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    response.status(401).json({ message: "Invalid credentials" });
    return;
  }
  const accessToken = generateAccessToken(
    (user._id as Types.ObjectId).toString(),
    user.role
  );
  const refreshToken = generateRefreshToken(
    (user._id as Types.ObjectId).toString()
  );

  response.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: keepMeLoggedIn === true ? 7 * 24 * 60 * 60 * 1000 : undefined, // 7 days
  });

  response.json({ token: accessToken });
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json({ message: "No refresh token" });
    return;
  }
  try {
    const decoded = verifyRefreshToken(token) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    const newAccessToken = generateAccessToken(
      (user._id as Types.ObjectId).toString(),
      user.role
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ message: "Logged out" });
};
