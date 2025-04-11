import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SharedState {
  cartCount: number;
}

const initialState: SharedState = {
  cartCount: 0,
};

const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    setSharedState: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
  },
});

export const { setSharedState } = sharedSlice.actions;
export default sharedSlice.reducer;
