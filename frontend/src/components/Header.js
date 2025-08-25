import React from "react";
import { LogOut, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Header() {
  const { logout } = useAuth();
  let navigate = useNavigate();

  return (
    <header className="header">
      <div
        className="logo"
        onClick={() => {
          navigate("/main");
        }}
      >
        🛡️ Saferise Platform
      </div>
      <div className="button-div">
        <button
          onClick={() => {
            navigate("/orders");
          }}
          className="bell-button header-button"
        >
          <Bell size={18} />
        </button>
        <button onClick={logout} className="logout-button header-button">
          <LogOut size={18} style={{ marginRight: "8px" }} />
        </button>
      </div>
    </header>
  );
}

export default Header;
