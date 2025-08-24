import React from "react";
import { useAuth } from "../context/AuthContext";

function AlertsPage() {
  const { inspector, logout } = useAuth();
  const data = [
    { priority: 1, name: "a", location: "a" },
    { priority: 2, name: "b", location: "b" },
    { priority: 3, name: "c", location: "c" },
    { priority: 3, name: "d", location: "d" },
  ];
  if (!inspector) {
    return (
      <div className="container">
        <div className="loading">Loading alerts</div>
      </div>
    );
  }
  if (!data) {
    return <div className="main-container">loading...</div>;
  }
  return <div className="main-container"></div>;
}

export default AlertsPage;
