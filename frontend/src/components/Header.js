import React from "react";
import { LogOut, Bell } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
function Header({ logout }) {
  let navigate = useNavigate();
  const handleLogout = () => {
    logout();
  };
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
            navigate("/alerts");
          }}
          className="bell-button header-button"
        >
          <Bell size={18} />
        </button>
        <button onClick={handleLogout} className="logout-button header-button">
          <LogOut size={18} style={{ marginRight: "8px" }} />
        </button>
      </div>
    </header>
  );
}

export default Header;
