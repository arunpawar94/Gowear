import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

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

  if (!isAuthenticated && checkRefreshToken) return <Navigate to="/" />;
  if (!allowedRoles.includes(role || "") && checkRefreshToken)
    return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
