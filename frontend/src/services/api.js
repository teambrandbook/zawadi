import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,  // send cookies on every request
})

// ── Request interceptor: attach Bearer token automatically ────────────────────
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: auto-refresh on 401, redirect on second failure ─────
let isRefreshing = false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry && !isRefreshing) {
      original._retry = true
      isRefreshing = true
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/account/refresh/`,
          {},
          { withCredentials: true }
        )
        isRefreshing = false
        return api(original)
      } catch {
        isRefreshing = false
        if (typeof window !== "undefined") {
          window.location.href = "/communitLogin"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const getAccessToken = () => {
  if (typeof document === "undefined") return null
  const cookies = document.cookie.split("; ")
  const token = cookies.find((c) => c.startsWith("access_token="))
  return token ? token.split("=")[1] : null
}