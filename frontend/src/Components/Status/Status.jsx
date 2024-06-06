import React from "react";
import { useNavigate } from "react-router-dom";
import "./Status.css";

const Status = ({ isPremium }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/");
  };

  return (
    <div className="status-wrapper">
      <div className="status-box">
        <h1>Status</h1>
        <p>Welcome, {isPremium ? "Premium User" : "Free User"}!</p>
        <p>Here are your status details...</p>
        {isPremium && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Status;
