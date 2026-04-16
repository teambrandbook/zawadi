import api from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

const REGISTER_API_URL = "http://127.0.0.1:8000/api/account/register/";

type RegisterPayload = Record<string, unknown>;
type RegisterErrorResponse = { message?: string; detail?: string; error?: string };

type UserState = {
  data: Record<string, unknown> | null;
  loading: boolean;
  success: boolean;
  error: string | null;
};

const initialState: UserState = {
  data: null,
  loading: false,
  success: false,
  error: null,
};

export const registerUser = createAsyncThunk<
  Record<string, unknown>,
  RegisterPayload,
  { rejectValue: string }
>("users/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post(REGISTER_API_URL, payload);
    return res.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<RegisterErrorResponse>;
    const message =
      axiosError?.response?.data?.message ||
      axiosError?.response?.data?.detail ||
      axiosError?.response?.data?.error ||
      "Registration failed. Please try again.";
    return rejectWithValue(message);
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearRegisterState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Registration failed. Please try again.";
      });
  },
});

export const { clearRegisterState } = userSlice.actions;
export default userSlice.reducer;
