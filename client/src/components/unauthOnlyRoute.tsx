import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const UnauthOnlyRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default UnauthOnlyRoute;
