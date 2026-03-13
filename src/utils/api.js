import axios from "axios";


const API_URL = "https://glowup-ai-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("glowup_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const faceAPI = {
  analyze: (imageBase64, mediaType = "image/jpeg") =>
    api.post("/face/analyze", { imageBase64, mediaType }),
  history: () => api.get("/face/history"),
};

export const fitnessAPI = {
  plan: (data) => api.post("/fitness/plan", data),
  history: () => api.get("/fitness/history"),
};

export const fashionAPI = {
  analyze: (imageBase64, occasion, mediaType = "image/jpeg") =>
    api.post("/fashion/analyze", { imageBase64, mediaType, occasion }),
  history: () => api.get("/fashion/history"),
  wardrobeOutfit: (data) => api.post("/fashion/wardrobe", data),
};

export const skinAPI = {
  analyze: (data) => api.post("/skin/analyze", data),
};

export const chatAPI = {
  message: (message) => api.post("/chat/message", { message }),
};

export const userAPI = {
  profile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  analyses: (params) => api.get("/user/analyses", { params }),
  deleteAnalysis: (id) => api.delete(`/user/analyses/${id}`),
};

export const paymentAPI = {
  createOrder: (data) => api.post("/payment/create-order", data),
  verify: (data) => api.post("/payment/verify", data),
};

export default api;