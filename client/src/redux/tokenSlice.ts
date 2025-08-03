import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenInterface {
  token: string | null;
  intervalId: ReturnType<typeof setInterval> | null;
  checkRefreshToken: boolean;
}

const initialState: TokenInterface = {
  token: null,
  intervalId: null,
  checkRefreshToken: false,
};

const accessToken = createSlice({
  name: "accessToken",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setIntervalId: (
      state,
      action: PayloadAction<ReturnType<typeof setInterval> | null>
    ) => {
      state.intervalId = action.payload;
    },
    setCheckRefreshToken: (state, action: PayloadAction<boolean>) => {
      state.checkRefreshToken = action.payload;
    },
  },
});

export const { setAccessToken, setIntervalId, setCheckRefreshToken } =
  accessToken.actions;
export default accessToken.reducer;
