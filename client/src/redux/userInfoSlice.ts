import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfoInterface {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImage: string;
}

const initialState: UserInfoInterface = {
  id: "",
  email: "",
  name: "",
  role: "",
  profileImage: "",
};

const userInfoSlice = createSlice({
  name: "user information",
  initialState,
  reducers: {
    setUserInformationReducer: (
      _state,
      action: PayloadAction<UserInfoInterface>
    ) => {
      return action.payload;
    },
    clearUserInformationReducer: () => {
      return initialState;
    },
  },
});

export const { setUserInformationReducer, clearUserInformationReducer } =
  userInfoSlice.actions;
export default userInfoSlice.reducer;
