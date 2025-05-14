import { useEffect } from "react";
import axiosApi from "../utils/axios";

export const useAuth = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axiosApi.post("/api/auth/refresh-token");
      } catch (err) {
        console.error("Auto refresh failed", err);
      }
    }, 50 * 60 * 1000); // every 10 mins
    return () => clearInterval(interval);
  }, []);
};
