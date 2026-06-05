import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if (token && config.headers) {
      (config.headers as Record<string, string>)["Authorization"] =
        `Bearer ${token}`;
    }

    return config;
  });
}

export default api;
