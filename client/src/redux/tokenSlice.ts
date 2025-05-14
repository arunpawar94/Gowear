import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenInterface {
  token: string | null;
}

const initialState: TokenInterface = {
  token: null,
};

const accessToken = createSlice({
  name: "accessToken",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
});

export const { setAccessToken } = accessToken.actions;
export default accessToken.reducer;
