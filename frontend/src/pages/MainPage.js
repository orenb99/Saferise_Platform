import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Shield, Mail, IdCard } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  let navigate = useNavigate();
  const { inspector, logout } = useAuth();

  if (!inspector) {
    return (
      <div className="container">
        <div className="loading">Loading user information...</div>
      </div>
    );
  }

  const getRoleIcon = (type) => {
    switch (type) {
      case "Chief":
        return "👑";
      case "Regional":
        return "👤";
      default:
        return "👤";
    }
  };

  const getRoleColor = (type) => {
    switch (type) {
      case "Chief":
        return "#f59e0b";
      case "Regional":
        return "#3b82f6";
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
              <span>{inspector.fullName}</span>
            </div>

            <div className="user-detail">
              <span>
                <strong>🆔 Israeli ID:</strong>
              </span>
              <span>{inspector.inspectorId}</span>
            </div>

            <div className="user-detail">
              <span>
                <strong>📧 Email:</strong>
              </span>
              <span>{inspector.email}</span>
            </div>

            <div className="user-detail">
              <span>
                <strong>{getRoleIcon(inspector.inspectorType)} Role:</strong>
              </span>
              <span
                style={{
                  color: getRoleColor(inspector.inspectorType),
                  fontWeight: "bold",
                }}
              >
                {inspector.inspectorType}
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
