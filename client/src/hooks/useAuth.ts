import { useEffect } from "react";
import axiosApi from "../utils/axios";
import { setAccessToken } from "../redux/tokenSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axiosApi.post("/users/refresh_token");
        dispatch(setAccessToken(response.data.token));
      } catch (err) {
        console.error("Auto refresh failed", err);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
};
