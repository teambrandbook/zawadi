import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const ACCESS_TOKEN_KEY = "zawadi_access_token";
const AUTH_ROUTES = ["/login", "/signup", "/register", "/otp", "/forgot-password"];
const PROTECTED_ROUTES = [
  "/admindashboard",
  "/communityDashBoard",
  "/consultant",
  "/guestprofile",
  "/checkout",
];

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ─── Access token store ───────────────────────────────────────────────────────
let _memoryToken = null;

export const setAccessToken = (token) => {
  _memoryToken = token || null;
  if (typeof window !== "undefined" && token) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const clearAccessToken = () => {
  _memoryToken = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    document.cookie = "access_token=; Max-Age=0; path=/";
  }
};

export const getAccessToken = () => {
  if (_memoryToken) return _memoryToken;
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    if (stored) {
      _memoryToken = stored;
      return stored;
    }
  }

  // Fallback: cookie (works when COOKIE_DOMAIN=.zewadi.com is set in production)
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("access_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

// ─── Request interceptor — attach Bearer token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint =
      config.url?.includes("/account/login/") ||
      config.url?.includes("/account/register/") ||
      config.url?.includes("/account/refresh/") ||
      config.url?.includes("/account/logout/");

    const token = getAccessToken();
    if (token && !isAuthEndpoint) {
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

const isAuthRoute = () => {
  if (typeof window === "undefined") return false;
  return AUTH_ROUTES.some((route) => window.location.pathname.startsWith(route));
};

const isProtectedRoute = () => {
  if (typeof window === "undefined") return false;
  return PROTECTED_ROUTES.some((route) => window.location.pathname.startsWith(route));
};

api.interceptors.response.use(
  (response) => {
    const token = response.data?.access;
    if (typeof token === "string" && token) {
      setAccessToken(token);
    }

    if (response.config?.url?.includes("/account/logout/")) {
      clearAccessToken();
    }

    return response;
  },
  async (error) => {
    const original = error.config;
    if (!original) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      original.url?.includes("/account/refresh/") ||
      original.url?.includes("/account/login/");

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}/account/refresh/`,
          {},
          { withCredentials: true }
        );
        // Capture the new access token from the response body
        const newToken = refreshResponse.data?.access;
        if (newToken) setAccessToken(newToken);

        processQueue(null);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError);
        clearAccessToken();
        if (isProtectedRoute() && !isAuthRoute()) {
          window.location.replace("/login");
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
