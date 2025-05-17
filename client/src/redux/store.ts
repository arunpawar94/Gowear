import { configureStore } from "@reduxjs/toolkit";
import sharedReducer from "./sharedSlice";
import tokenReducer from "./tokenSlice";
import userInfoReducer from "./userInfoSlice";
import snackbarMsgReducer from "./snackbarMsgsSlice";

const store = configureStore({
  reducer: {
    shared: sharedReducer,
    tokenReducer: tokenReducer,
    userInfoReducer: userInfoReducer,
    snackbarSliceReducer: snackbarMsgReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
