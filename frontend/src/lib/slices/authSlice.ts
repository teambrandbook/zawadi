import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type UserRole = "admin" | "community_user" | "consultant" | "internal_staff" | null

interface AuthState {
  userId: string | null
  email: string | null
  role: UserRole
  isAuthenticated: boolean
}

const initialState: AuthState = {
  userId: null,
  email: null,
  role: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ userId: string; email: string; role: UserRole }>
    ) {
      state.userId = action.payload.userId
      state.email = action.payload.email
      state.role = action.payload.role
      state.isAuthenticated = true
    },
    clearCredentials(state) {
      state.userId = null
      state.email = null
      state.role = null
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
