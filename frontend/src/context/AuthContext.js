import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI, tokenStorage } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  // console.log(state, action);
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenStorage.get();
      if (token) {
        try {
          // Verify token is still valid
          const response = await authAPI.getCurrentUser();
          dispatch({ type: "SET_USER", payload: response.user });
        } catch (error) {
          // Token is invalid, clear storage
          tokenStorage.remove();
          dispatch({ type: "SET_USER", payload: null });
        }
      } else {
        dispatch({ type: "SET_USER", payload: null });
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await authAPI.signUp(userData);

      // Store token and user data
      tokenStorage.set(response.token);

      dispatch({ type: "SET_USER", payload: response.user });
      toast.success("Account created successfully!");

      return response;
    } catch (error) {
      const errorMessage = error.error || "Sign up failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const signIn = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await authAPI.signIn(credentials);

      // Store token and user data
      tokenStorage.set(response.token);

      dispatch({ type: "SET_USER", payload: response.user });
      toast.success(`Welcome back, ${response.user.fullName}!`);

      return response;
    } catch (error) {
      const errorMessage = error.error || "Sign in failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    tokenStorage.remove();
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const clearError = () => {
    dispatch({ type: "SET_ERROR", payload: null });
  };

  const value = {
    ...state,
    signUp,
    signIn,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
