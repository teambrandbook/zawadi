import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "users/register",
  async (data: any) => {
    const res = await api.post("/account/register/", data);
    return res.data;
  }
);