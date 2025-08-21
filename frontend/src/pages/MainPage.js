import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Shield, Mail, IdCard } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  let navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <div className="loading">Loading user information...</div>
      </div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "Director":
        return "👑";
      case "Supervisor":
        return "🔧";
      case "Employee":
        return "👤";
      default:
        return "👤";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Director":
        return "#f59e0b";
      case "Supervisor":
        return "#3b82f6";
      case "Employee":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="main-container">
      <Header logout={logout} />

      <main className="main-content">
        <div className="welcome-card">
          <h1 className="welcome-title">
            <span>Welcome to Saferise!</span> 👋
          </h1>
          <p className="welcome-subtitle">Your secure employee management dashboard</p>

          <div className="user-info">
            <h3>
              <User size={20} style={{ marginRight: "8px", display: "inline" }} />
              Your Profile Information
            </h3>

            <div className="user-detail">
              <span>
                <strong>👤 Full Name:</strong>
              </span>
              <span>{user.fullName}</span>
            </div>

            <div className="user-detail">
              <span>
                <strong>🆔 Israeli ID:</strong>
              </span>
              <span>{user.id}</span>
            </div>

            <div className="user-detail">
              <span>
                <strong>📧 Email:</strong>
              </span>
              <span>{user.email}</span>
            </div>

            <div className="user-detail">
              <span>
                <strong>{getRoleIcon(user.role)} Role:</strong>
              </span>
              <span
                style={{
                  color: getRoleColor(user.role),
                  fontWeight: "bold",
                }}
              >
                {user.role}
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "10px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#059669",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              ✅ You are successfully authenticated and logged in!
            </p>
          </div>
        </div>
        <div
          className="inspection-card sub-card"
          onClick={() => {
            navigate("/inspections");
          }}
        >
          <div className="welcome-title">
            🔎 <span>Search for Inspections</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
