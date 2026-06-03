import api, { clearAccessToken } from "@/services/api";
import { getGuestCart, clearGuestCart, getGuestCartCount } from "@/lib/guestCart";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { unregisterPushBeforeLogout } from "@/lib/firebaseMessaging";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserState {
  userId: string | null;
  role: string | null;
  email: string | null;
  fullName: string | null;
  photo: string | null;
  userType: "guest" | "member" | null;
  permissions: "all" | UserPermission[];
  cartCount: number;
  isAuthenticated: boolean;
  /** True from app boot until the /account/me/ rehydration call settles (success or failure). */
  isRehydrating: boolean;
  loading: boolean;
  error: string | null;
}

export type UserPermission = {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_approve: boolean;
  can_export: boolean;
  full_access: boolean;
};

const initialState: UserState = {
  userId: null,
  role: null,
  email: null,
  fullName: null,
  photo: null,
  userType: null,
  permissions: [],
  cartCount: 0,
  isAuthenticated: false,
  isRehydrating: true,
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
  await unregisterPushBeforeLogout();
  await api.post("/account/logout/");
  clearAccessToken();
});

export const fetchCartCount = createAsyncThunk("user/fetchCartCount", async () => {
  try {
    const res = await api.get<{ summary: { item_count: number } }>("/orders/cart/");
    return Number(res.data.summary?.item_count ?? 0);
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } }).response?.status;
    if (status === 401 || status === 403) {
      return getGuestCartCount();
    }
    return 0;
  }
});

export const upgradeToMember = createAsyncThunk(
  "user/upgradeToMember",
  async (_, { rejectWithValue }) => {
    try {
      await api.patch("/account/upgrade/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown } };
      return rejectWithValue(error.response?.data ?? "Upgrade failed");
    }
  }
);

export const drainGuestCart = createAsyncThunk(
  "user/drainGuestCart",
  async () => {
    const items = getGuestCart();
    if (items.length === 0) return 0;
    await Promise.allSettled(
      items.map((item) =>
        api.post("/orders/cart/items/", {
          product_id: item.productId,
          ...(item.variantId ? { variant_id: item.variantId } : {}),
          quantity: item.quantity,
        })
      )
    );
    clearGuestCart();
    try {
      const res = await api.get<{ summary: { item_count: number } }>("/orders/cart/");
      return Number(res.data.summary?.item_count ?? 0);
    } catch {
      return 0;
    }
  }
);

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
        photo?: string | null;
        userType?: "guest" | "member" | null;
        permissions?: "all" | UserPermission[];
      }>
    ) {
      const { userId, role, email, fullName, photo, userType, permissions } = action.payload;
      if (userId !== undefined) state.userId = userId;
      if (role !== undefined) state.role = role;
      if (email !== undefined) state.email = email;
      if (fullName !== undefined) state.fullName = fullName;
      if (photo !== undefined) state.photo = photo;
      if (userType !== undefined) state.userType = userType;
      if (permissions !== undefined) state.permissions = permissions;
      state.isAuthenticated = true;
      state.error = null;
    },
    setCartCount(state, action: PayloadAction<number>) {
      state.cartCount = Math.max(0, Number(action.payload) || 0);
    },
    clearCredentials(state) {
      state.userId = null;
      state.role = null;
      state.email = null;
      state.fullName = null;
      state.photo = null;
      state.userType = null;
      state.permissions = [];
      state.cartCount = 0;
      state.isAuthenticated = false;
      state.error = null;
    },
    /** Marks the AuthRehydrator /account/me/ call as settled (success or failure). */
    setRehydrated(state) {
      state.isRehydrating = false;
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
        state.permissions = d.permissions ?? [];
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
      state.permissions = [];
      state.cartCount = 0;
      state.isAuthenticated = false;
    });

    builder
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.cartCount = action.payload;
      })
      .addCase(fetchCartCount.rejected, (state) => {
        state.cartCount = 0;
      });

    // upgradeToMember
    builder.addCase(upgradeToMember.fulfilled, (state) => {
      state.userType = "member";
    });

    // drainGuestCart
    builder.addCase(drainGuestCart.fulfilled, (state, action) => {
      state.cartCount = action.payload;
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

export const { setCredentials, clearCredentials, setCartCount, setRehydrated } = userSlice.actions;
export default userSlice.reducer;
