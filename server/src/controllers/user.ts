import { Request, Response } from "express";
import User from "../models/userModel";

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
      accountVerified: role === "user"
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
