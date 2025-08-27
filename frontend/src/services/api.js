import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  signUp: async (userData) => {
    try {
      const response = await api.post("/auth/signup", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Network error occurred" };
    }
  },

  signIn: async (credentials) => {
    try {
      const response = await api.post("/auth/signin", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Network error occurred" };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Network error occurred" };
    }
  },
};

// Helper to convert params object to query string
function toQueryStringBrackets(obj) {
  return Object.keys(obj)
    .map((key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        return value.map((v) => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");
}

// review API
export const reviewAPI = {
  searchReviews: async (params) => {
    let queryString = toQueryStringBrackets(params);
    try {
      const response = await api.get("/reviews/search?" + queryString);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Network error occurred" };
    }
  },
  getReviewById: async (id) => {
    try {
      const response = await api.get(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Network error occurred" };
    }
  },
};

export const orderAPI = {
  createOrder: async (order) => {
    try {
      const response = await api.post("/orders", order);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Network error occurred" };
    }
  },
};

export const alertAPI = {
  // No need to pass inspectorId, it's passed with the token
  getAllAlertsByInspector: async () => {
    try {
      const response = await api.get(`/alerts/all`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Network error occurred" };
    }
  },
  getTopFiveAlerts: async () => {
    try {
      const response = await api.get(`/alerts/top`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Network error occurred" };
    }
  },
};

export const publicAPI = {
  fetchReviewPDF: (path) => {
    return api.defaults.baseURL + "/public/reviews/" + path;
  },
};

// Utility functions for local storage
export const tokenStorage = {
  set: (token) => {
    localStorage.setItem("token", token);
  },

  get: () => {
    return localStorage.getItem("token");
  },

  remove: () => {
    localStorage.removeItem("token");
  },
};

export default api;
