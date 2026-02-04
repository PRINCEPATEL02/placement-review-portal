import axios from "axios";

const API_BASE_URL = window.location.hostname === 'localhost'
  ? "http://localhost:5000/api"
  : "https://placement-review-portal.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response;
  },

  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response;
  },

  // Forgot password
  forgotPassword: async (data) => {
    const response = await api.post("/auth/forgot-password", data);
    return response;
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await api.post("/auth/reset-password", data);
    return response;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response;
  },
};

export default api;
