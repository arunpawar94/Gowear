import User, { IUser } from "../models/userModel";
import { HydratedDocument } from "mongoose";
import mongoose, { Types } from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtToken";

export interface UserInteface {
  name: string;
  email: string;
  password?: string;
  role: "user" | "product_manager" | "admin";
  profileImage: {
    imgUrl: string;
    publicId: string;
  };
  dateOfBirth: string;
  methodToSignUpLogin: string;
  termsAndPolicies: boolean;
  emailVerified: boolean;
  adminVerification: "pending" | "approved" | "rejected";
}

interface SignInInterfaceBody {
  email: string;
  password?: string;
  methodToSignUpLogin: string;
  keepMeLoggedIn: boolean;
}

interface SignInReturnUser {
  email: string;
  role: "user" | "product_manager" | "admin";
  profileImage: {
    imgUrl: string;
    publicId: string;
  };
}

export const createNewUser = async (
  userInfo: UserInteface
): Promise<{ user: HydratedDocument<IUser> }> => {
  const existing = await User.findOne({ email: userInfo.email });
  if (existing) {
    const error = new Error("User already exists");
    error.name = "UserExistsError";
    throw error;
  }
  try {
    const newUser = new User(userInfo);
    await newUser.save();
    return { user: newUser };
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.ValidationError) {
      const updateError: Record<string, string> = {};
      for (const key in err.errors) {
        updateError[key] = err.errors[key].message;
      }
      const errorArray = Object.values(updateError);
      const error = new Error(errorArray.join(","));
      error.name = "ValidationError";
      throw error;
    }

    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: number }).code === 11000 &&
      "keyValue" in err &&
      (err as any).keyValue?.email
    ) {
      const error = new Error("User already exists");
      error.name = "UserExistsError";
      throw error;
    }

    const error = new Error(
      err instanceof Error ? err.message : "Something went wrong"
    );
    error.name = "UnknownError";
    throw error;
  }
};

export const authenticateExistingUser = async (
  loginCredential: SignInInterfaceBody
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: SignInReturnUser;
}> => {
  const user = await User.findOne({ email: loginCredential.email });
  if (!user) {
    const error = new Error("User not exists");
    error.name = "UserNotExistsError";
    throw error;
  }

  if (user && user.methodToSignUpLogin === "email") {
    const isMatch = await user.comparePassword(
      loginCredential.password as string
    );
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.name = "InvalidCredentials";
      throw error;
    }
  }

  if (user && user.emailVerified === false) {
    const error = new Error("Email not verified.");
    error.name = "UnverifiedEmail";
    throw error;
  }

  if (user && user.role !== "user" && user.adminVerification !== "approved") {
    const error = new Error("Account not approved by admin.");
    error.name = "NotApproved";
    throw error;
  }

  const accessToken = generateAccessToken(
    (user._id as Types.ObjectId).toString(),
    user.role
  );

  const refreshToken = generateRefreshToken(
    (user._id as Types.ObjectId).toString(),
    loginCredential.keepMeLoggedIn === true ? "7d" : "12h"
  );

  const userInfo = await User.findOne(
    { email: loginCredential.email },
    { email: 1, role: 1, name: 1, profileImage: 1 }
  );

  return { accessToken, refreshToken, user: userInfo! };
};
