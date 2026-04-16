import api from "@/services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRoles = createAsyncThunk("roles/fetch", async () => {
  const res = await api.get("/supperadmin/roles/");
  return res.data;
});

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRoles.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default roleSlice.reducer;