import axios from "axios";
import { Request, Response } from "express";
import {
  createNewUser,
  authenticateExistingUser,
} from "../services/authService";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { code, redirectUri } = req.body;
    const { action } = req.query;
    if (!code || !redirectUri) {
      res
        .status(400)
        .json({ message: "error", error: "Missing code or redirectUri" });
      return;
    }
    const tokenRes = await axios.post(`https://oauth2.googleapis.com/token`, {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });
    const { access_token } = tokenRes.data;

    const profileRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { email, name, picture } = profileRes.data;
    if (action === "signUp") {
      const { role, methodToSignUpLogin, termsAndPolicies } = req.body;
      const rawData = {
        profileImage: {
          imgUrl: picture,
          publicId: "",
        },
        dateOfBirth: "",
        emailVerified: true,
        accountVerified: role === "user",
      };
      const newUser = await createNewUser({
        ...rawData,
        name,
        email,
        role,
        methodToSignUpLogin,
        termsAndPolicies,
      });
      res.status(201).json({ message: "success", data: newUser });
      return;
    }
    if (action === "signIn") {
      const { keepMeLoggedIn, methodToSignUpLogin } = req.body;

      const loginCredential = {
        email,
        keepMeLoggedIn,
        methodToSignUpLogin,
      };
      const loginResponse = await authenticateExistingUser(loginCredential);

      res.cookie("refreshToken", loginResponse.refreshToken, {
        // httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge:
          keepMeLoggedIn === true
            ? 7 * 24 * 60 * 60 * 1000
            : 12 * 60 * 60 * 1000, // 7 days or 12 hours
      });

      res.json({
        message: "success",
        data: { user: loginResponse.user, token: loginResponse.accessToken },
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "ValidationError") {
        const errorArray = err.message.split(",").map((e) => e.trim());
        res.status(400).json({ message: "error", errors: errorArray });
      } else if (err.name === "UserExistsError") {
        res.status(400).json({ message: "error", errors: err.message });
      } else {
        res.status(400).json({ message: "error", error: err.message });
      }
    } else {
      res.status(500).json({
        message: "error",
        errors: [err instanceof Error ? err.message : "Unknown server error"],
      });
    }
  }
};
