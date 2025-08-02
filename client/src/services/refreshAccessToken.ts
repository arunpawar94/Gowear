import axiosApi from "../utils/axios";
import { setAccessToken, setIntervalId } from "../redux/tokenSlice";
import { AppDispatch } from "../redux/store";
import { AxiosError } from "axios";

export default function refreshAccessToken(dispatch: AppDispatch) {
  const interval = setInterval(async () => {
    try {
      const response = await axiosApi.post("/users/refresh_token");
      dispatch(setAccessToken(response.data.token));
    } catch (err) {
      const erro = err as AxiosError;
      const data = erro.response!.data! as { error: string };
      if (data.error === "No refresh token") {
        clearInterval(interval);
      }
    }
  }, 10 * 60 * 1000);

  dispatch(setIntervalId(interval));
}
