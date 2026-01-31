import { Dispatch, SetStateAction } from "react";
import { AppDispatch } from "../redux/store";
import axiosApi from "../utils/axios";
import { setAccessToken } from "../redux/tokenSlice";
import { clearUserInformationReducer } from "../redux/userInfoSlice";
import { useNavigate } from "react-router-dom";

export default function logoutUser(
  dispatch: AppDispatch,
  navigate: ReturnType<typeof useNavigate>,
  setAnchorEl?: Dispatch<SetStateAction<HTMLElement | null>>,
) {
  axiosApi
    .post("/users/log_out")
    .then((_response) => {
      dispatch(setAccessToken(null));
      dispatch(clearUserInformationReducer());
      navigate("/");
      if (setAnchorEl) {
        setAnchorEl(null);
      }
    })
    .catch((_error) => {
      if (setAnchorEl) {
        setAnchorEl(null);
      }
    });
}
