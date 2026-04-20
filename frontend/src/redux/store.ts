import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./roleSlice";

export const store = configureStore({
  reducer: {
    roles: roleReducer, // ✅ only roles
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;