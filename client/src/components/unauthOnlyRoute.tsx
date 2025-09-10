import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Box, Typography } from "@mui/material";
import GradientCircularProgress from "./GradientCircularProgress";
import { primaryColor } from "../config/colors";

const UnauthOnlyRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  const checkRefreshToken = useSelector(
    (state: RootState) => state.tokenReducer.checkRefreshToken
  );
  if (!checkRefreshToken)
    return (
      <Box style={webStyle.modalBox}>
        <GradientCircularProgress size={50} margin="10px" />
        <br />
        <Typography style={webStyle.textStyle}>Authenticating...</Typography>
      </Box>
    );
  return isAuthenticated && checkRefreshToken ? <Navigate to="/" /> : children;
};

export default UnauthOnlyRoute;

const webStyle = {
  modalBox: {
    height: "500px",
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
