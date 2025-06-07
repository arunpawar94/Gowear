// context/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null; // "admin", "product_manager", etc.
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
});

export const useAuth = () => useContext(AuthContext);

// Wrap your App with this provider
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
