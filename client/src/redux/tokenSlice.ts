import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenInterface {
  token: string | null;
  intervalId: ReturnType<typeof setInterval> | null;
}

const initialState: TokenInterface = {
  token: null,
  intervalId: null
};

const accessToken = createSlice({
  name: "accessToken",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setIntervalId: (state, action: PayloadAction<ReturnType<typeof setInterval> | null>) => {
      state.intervalId = action.payload;
    },
  },
});

export const { setAccessToken, setIntervalId } = accessToken.actions;
export default accessToken.reducer;
