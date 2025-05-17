import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MsgType = string | null;

interface SnackbarMsg {
  successMsg: MsgType;
  errorMsg: MsgType;
}

const initialState: SnackbarMsg = {
  successMsg: null,
  errorMsg: null,
};

const snackbarSlice = createSlice({
  name: "snackbar slice",
  initialState,
  reducers: {
    setSuccessMsg: (state, action: PayloadAction<MsgType>) => {
      state.successMsg = action.payload;
    },
    setErrorMsg: (state, action: PayloadAction<MsgType>) => {
      state.errorMsg = action.payload;
    },
  },
});

export const { setSuccessMsg, setErrorMsg } = snackbarSlice.actions;
export default snackbarSlice.reducer;
