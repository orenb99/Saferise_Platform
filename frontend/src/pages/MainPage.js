import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, User, Shield, Mail, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { alertAPI } from "../services/api";
import toast from "react-hot-toast";

const MainPage = () => {
  let navigate = useNavigate();
  const { inspector } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  useEffect(() => {
    if (!inspector) return;
    const fetchAlerts = async () => {
      try {
        const response = await alertAPI.getTopFiveAlerts();
        setAlerts(response.data.topFive);
        setAlertCount(response.data.count);
      } catch (error) {
        const message = error.error || "An error occurred";
        toast.error(message);
      }
    };
    fetchAlerts();
  }, [inspector]);
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

  const showNotification = () => {
    if (alertCount > 0) {
      return (
        <span className="notification">
          <div className="notification-inner">{alertCount}</div>
          <MessageSquare size={60} fill="red" color="black" strokeWidth="0.2px" />
        </span>
      );
    }
  };
  const showAlerts = () => {
    if (!alerts || alerts.length === 0) {
      return <div>No recent alerts</div>;
    }
    return alerts.map((alert) => (
      <div key={alert.alertId} className="alert-item">
        <div>{alert.title}</div>
        <div>{alert.priority}</div>
        <div>{alert.alertType}</div>
        <div>{alert.status}</div>
        <div>{new Date(alert.dueDate).toLocaleDateString("en-GB")}</div>
      </div>
    ));
  };
  return (
    <div className="main-container">
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
        <div className="sub-cards-container">
          {/* Review search page banner */}
          <div
            className="review-card sub-card "
            onClick={() => {
              navigate("/reviews");
            }}
          >
            <div className="welcome-title">
              🔎 <span>Search for Reviews</span>
            </div>
          </div>
          {/* Alerts page banner */}
          <div className="notification-target">
            <div
              className="alert-card sub-card"
              onClick={() => {
                navigate("/alerts");
              }}
            >
              {showNotification()}

              <div className="welcome-title">
                🚨 <span>View Your Alerts</span>
              </div>
              <div
                className="top-five-alerts"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {showAlerts()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
