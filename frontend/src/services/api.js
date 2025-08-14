import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  signUp: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error occurred' };
    }
  },

  signIn: async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error occurred' };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error occurred' };
    }
  }
};

// Utility functions for local storage
export const tokenStorage = {
  set: (token) => {
    localStorage.setItem('token', token);
  },
  
  get: () => {
    return localStorage.getItem('token');
  },
  
  remove: () => {
    localStorage.removeItem('token');
  }
};

export const userStorage = {
  set: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  get: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  remove: () => {
    localStorage.removeItem('user');
  }
};

export default api;
