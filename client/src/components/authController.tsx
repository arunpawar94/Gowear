import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Modal, Typography, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setSuccessMsg, setErrorMsg } from "../redux/snackbarMsgsSlice";
import { setAccessToken } from "../redux/tokenSlice";
import { setUserInformationReducer } from "../redux/userInfoSlice";
import { lightTextColor, primaryColor } from "../config/colors";

const base_url = process.env.REACT_APP_API_URL;

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lightTextColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </React.Fragment>
  );
}

export const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const hasAuthenticatedRef = useRef(false);

  useEffect(() => {
    const authenticate = async () => {
      if (hasAuthenticatedRef.current) return;
      hasAuthenticatedRef.current = true;
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const providerName = urlParams.get("provider");
      const pathname = location.pathname;

      const action = pathname.includes("signUp") ? "signUp" : "signIn";
      const userRole = localStorage.getItem("role");
      const keepLoggedIn =
        localStorage.getItem("keepLoggedIn") === "true" ? true : false;

      const signInData = {
        keepMeLoggedIn: keepLoggedIn,
        methodToSignUpLogin: providerName,
        code,
        redirectUri: window.location.origin + "/auth/signIn?provider=google",
      };
      const signUpData = {
        role: userRole,
        methodToSignUpLogin: providerName,
        termsAndPolicies: true,
        code,
        redirectUri: window.location.origin + "/auth/signUp?provider=google",
      };
      const bodyData = action === "signUp" ? signUpData : signInData;
      axios
        .post(`${base_url}/users/auth/google`, bodyData, {
          params: {
            action: action,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (action === "signUp") {
            showSuccessMsg("You are registered successfully!");
            localStorage.removeItem("role");
            localStorage.removeItem("keepLoggedIn");
            navigate("/loginSignUp");
          }
          if (action === "signIn") {
            const responseUserData = response.data.data.user;
            const userInformation = {
              id: responseUserData._id,
              email: responseUserData.email,
              name: responseUserData.name,
              role: responseUserData.role,
              profileImage: responseUserData.profileImage.imgUrl,
            };
            localStorage.removeItem("role");
            localStorage.removeItem("keepLoggedIn");
            dispatch(setAccessToken(response.data.data.token));
            dispatch(setUserInformationReducer(userInformation));
            showSuccessMsg("Log in successfully!");
            navigate("/");
          }
        })
        .catch((error) => {
          if (action === "signUp") {
            if (Array.isArray(error.response.data.errors)) {
              showErrorMsg(error.response.data.errors[0]);
            } else {
              showErrorMsg(error.response.data.errors);
            }
            localStorage.removeItem("role");
            localStorage.removeItem("keepLoggedIn");
            navigate("/loginSignUp");
          }
          if (action === "signIn") {
            localStorage.removeItem("role");
            localStorage.removeItem("keepLoggedIn");
            showErrorMsg(error.response.data.error);
            navigate("/loginSignUp");
          }
        });
    };
    authenticate();
  }, [location]);

  const showSuccessMsg = (message: string) => {
    dispatch(setErrorMsg(null));
    dispatch(setSuccessMsg(message));
  };

  const showErrorMsg = (message: string) => {
    dispatch(setSuccessMsg(null));
    dispatch(setErrorMsg(message));
  };

  return (
    <Box style={webStyle.mainBox}>
      <Modal open={true}>
        <Box style={webStyle.modalBox}>
          <GradientCircularProgress />
          <br />
          <Typography style={webStyle.textStyle}>Authenticating...</Typography>
        </Box>
      </Modal>
    </Box>
  );
};

const webStyle = {
  mainBox: {
    height: "80vh",
    border: "1px solid red",
    display: "flex",
    alignItems: "center",
  },
  modalBox: {
    border: "1px solid red",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  textStyle: {
    fontSize: "30px",
    color: primaryColor,
  },
};
