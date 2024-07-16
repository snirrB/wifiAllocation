import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../Services/api";
import { LogoutButton } from "./../../components/buttons/buttons";
import "./Status.css";

const Status = () => {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState(null);
  const token = "be3e4d99";

  useEffect(() => {
    apiService
      .status(token)
      .then((data) => setStatusData(data))
      .catch((error) => console.error("Error fetching status:", error));
  }, [token]);

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/");
  };

  if (!statusData) {
    return <div>Loading...</div>;
  }

  const loginTime = statusData.login_time
    ? new Date(statusData.login_time).toLocaleString()
    : "N/A";
  const timeRemaining = statusData.time_remaining
    ? Object.entries(statusData.time_remaining)
        .map(([unit, value]) => `${value} ${unit}`)
        .join(", ")
    : "N/A";
  const currentSpeed =
    statusData.current_speed !== undefined
      ? `${statusData.current_speed} Mbps`
      : "N/A";

  return (
    <div className="status-wrapper">
      <div className="status-box">
        <LogoutButton />
        <h1>Status Page</h1>
        {/* <button className="logout-button" onClick={handleLogout}>
          Logout
        </button> */}
        <p style={{ color: "red", fontWeight: "bold", fontStyle: "italic" }}>
          TODO: Data format from server
        </p>
        <p>Login Time: {loginTime}</p>
        <p>Time Remaining: {timeRemaining}</p>
        <p>Current Speed: {currentSpeed} </p>
      </div>
    </div>
  );
};

export default Status;
