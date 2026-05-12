import api from "@/services/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserState {
  userId: string | null;
  role: string | null;
  email: string | null;
  fullName: string | null;
  userType: "guest" | "member" | null;
  cartCount: number;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userId: null,
  role: null,
  email: null,
  fullName: null,
  userType: null,
  cartCount: 0,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "user/register",
  async (data: Record<string, unknown> | FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/account/register/", data);
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown } };
      return rejectWithValue(error.response?.data ?? "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/account/login/", data);
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown } };
      return rejectWithValue(error.response?.data ?? "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  await api.post("/account/logout/");
});

export const fetchCartCount = createAsyncThunk("user/fetchCartCount", async () => {
  try {
    const res = await api.get<{ summary: { item_count: number } }>("/orders/cart/");
    return Number(res.data.summary?.item_count ?? 0);
  } catch {
    return 0;
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        userId?: string;
        role?: string;
        email?: string;
        fullName?: string;
        userType?: "guest" | "member" | null;
      }>
    ) {
      const { userId, role, email, fullName, userType } = action.payload;
      if (userId !== undefined) state.userId = userId;
      if (role !== undefined) state.role = role;
      if (email !== undefined) state.email = email;
      if (fullName !== undefined) state.fullName = fullName;
      if (userType !== undefined) state.userType = userType;
      state.isAuthenticated = true;
      state.error = null;
    },
    setCartCount(state, action: PayloadAction<number>) {
      state.cartCount = action.payload;
    },
    clearCredentials(state) {
      state.userId = null;
      state.role = null;
      state.email = null;
      state.fullName = null;
      state.userType = null;
      state.cartCount = 0;
      state.isAuthenticated = false;
      state.error = null;
    },
    setCartCount(state, action: PayloadAction<number>) {
      state.cartCount = Math.max(0, Number(action.payload) || 0);
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const d = action.payload?.data ?? action.payload;
        state.userId = d.user_id ?? d.userId ?? null;
        state.role = d.role ?? null;
        state.email = d.email ?? null;
        state.fullName =
          [d.first_name, d.last_name].filter(Boolean).join(" ") || null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Login failed";
      });

    // logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.userId = null;
      state.role = null;
      state.email = null;
      state.fullName = null;
      state.userType = null;
      state.cartCount = 0;
      state.isAuthenticated = false;
      state.cartCount = 0;
    });

    builder
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.cartCount = action.payload;
      })
      .addCase(fetchCartCount.rejected, (state) => {
        state.cartCount = 0;
      });

    // register (just tracks loading/error; does not auto-login)
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Registration failed";
      });
  },
});

export const { setCredentials, clearCredentials, setCartCount } = userSlice.actions;
export default userSlice.reducer;
