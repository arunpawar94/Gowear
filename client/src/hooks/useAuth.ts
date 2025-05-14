import { useEffect } from "react";
import axiosApi from "../utils/axios";

export const useAuth = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axiosApi.post("/users/refresh_token");
      } catch (err) {
        console.error("Auto refresh failed", err);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
};
