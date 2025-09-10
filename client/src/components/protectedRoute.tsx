import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Box, Typography } from "@mui/material";
import { primaryColor } from "../config/colors";
import GradientCircularProgress from "./GradientCircularProgress";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactElement;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, role } = useAuth();

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
  if (!isAuthenticated && checkRefreshToken) return <Navigate to="/" />;
  if (!allowedRoles.includes(role || "") && checkRefreshToken)
    return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;

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
