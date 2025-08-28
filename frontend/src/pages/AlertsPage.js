import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { alertAPI } from "../services/api";
import toast from "react-hot-toast";
function AlertsPage() {
  const { inspector } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await alertAPI.getAllAlertsByInspector();
        setOrders(res.data);
      } catch (error) {
        const message = error.error || "An error occurred";
        toast.error(message);
      }
    };
    getOrders();
  }, [inspector]);

  if (!inspector) {
    return (
      <div className="container">
        <div className="loading">Loading alerts</div>
      </div>
    );
  }
  // Get orders appointed to this inspector

  const mapData = () => {
    if (orders.length > 0) {
      return orders.map((order) => {
        return (
          <div key={order.orderId}>
            {order.orderId} - {order.reviewId}
          </div>
        );
      });
    } else {
      return <div>No orders</div>;
    }
  };
  if (!orders) {
    return <div className="main-container">loading...</div>;
  }
  return <div className="main-container">{mapData()}</div>;
}

export default AlertsPage;
