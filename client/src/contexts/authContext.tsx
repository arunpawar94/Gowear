import React, { createContext, useContext, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const accessToken = useSelector(
    (state: RootState) => state.tokenReducer.token
  );
  const isAuthenticated = Boolean(accessToken);
  const role = useSelector((state: RootState) => state.userInfoReducer.role);
  return (
    <AuthContext.Provider value={{ isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};
