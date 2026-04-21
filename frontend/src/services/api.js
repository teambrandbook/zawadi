import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends HttpOnly refresh_token cookie on every request
});

export const getAccessToken = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("access_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

// ─── Request interceptor — attach Bearer token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — auto-refresh on 401 ───────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only attempt refresh for 401s, and never for the refresh/login endpoints
    const isAuthEndpoint =
      original.url?.includes("/account/refresh/") ||
      original.url?.includes("/account/login/");

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue this request until the refresh resolves
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // Refresh — no Authorization header needed, uses HttpOnly cookie
        await axios.post(
          `${BASE_URL}/account/refresh/`,
          {},
          { withCredentials: true }
        );
        // New access_token cookie is now set by the server
        processQueue(null);
        return api(original); // retry original request with new token
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh token is expired/invalid — force logout
        if (typeof window !== "undefined") {
          window.location.href = "/communitLogin";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
