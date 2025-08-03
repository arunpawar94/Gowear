import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const UnauthOnlyRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  const checkRefreshToken = useSelector(
    (state: RootState) => state.tokenReducer.checkRefreshToken
  );

  return isAuthenticated && checkRefreshToken ? <Navigate to="/" /> : children;
};

export default UnauthOnlyRoute;
