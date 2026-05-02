import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./roleSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    roles: roleReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;