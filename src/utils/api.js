import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("glowup_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("glowup_token");
      localStorage.removeItem("glowup_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ── Face ──────────────────────────────────────────────────────────────────────
export const faceAPI = {
  analyze: (imageBase64, mediaType = "image/jpeg") =>
    api.post("/face/analyze", { imageBase64, mediaType }),
  history: () => api.get("/face/history"),
};

// ── Fitness ───────────────────────────────────────────────────────────────────
export const fitnessAPI = {
  plan: (data) => api.post("/fitness/plan", data),
  history: () => api.get("/fitness/history"),
};

// ── Fashion ───────────────────────────────────────────────────────────────────
export const fashionAPI = {
  analyze: (imageBase64, occasion, mediaType = "image/jpeg") =>
    api.post("/fashion/analyze", { imageBase64, mediaType, occasion }),
  history: () => api.get("/fashion/history"),
};

// ── User ──────────────────────────────────────────────────────────────────────
export const userAPI = {
  profile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  analyses: (params) => api.get("/user/analyses", { params }),
  deleteAnalysis: (id) => api.delete(`/user/analyses/${id}`),
};

export default api;
