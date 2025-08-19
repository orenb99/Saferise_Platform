import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import MainPage from "./pages/MainPage";
import AlertsPage from "./pages/AlertsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#10b981",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                },
              },
            }}
          />

          <Routes>
            {/* Redirect root to signup */}
            <Route path="/" element={<Navigate to="/signup" replace />} />

            {/* Public routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Protected routes */}
            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <AlertsPage />
                </ProtectedRoute>
              }
            />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
