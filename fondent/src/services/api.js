import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// 👉 get token from cookie
export const getAccessToken = () => {
  const cookies = document.cookie.split("; ");
  const token = cookies.find((c) => c.startsWith("access_token="));
  return token ? token.split("=")[1] : null;
};

// 👉 attach token automatically
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;