import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../Services/api";
import { LogoutButton } from "./../../components/buttons/buttons";
import "./Status.css";
import { http } from "../../Services/utils";
import { NO_TOKEN_URL } from "../LoginRegister/WaitForToken";

const Status = () => {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState(null);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(null);

  useEffect(() => {
    if (!http.token) {
      navigate(NO_TOKEN_URL);
    }
  }, [http.token]);

  useEffect(() => {
    if (!statusData) {
      apiService
        .userStatus(http.token)
        .then((data) => {
          setStatusData(data);
          const time_remaining = data.time_remaimning;
          const totalSeconds =
            time_remaining.days * 86400 +
            time_remaining.hours * 3600 +
            time_remaining.minutes * 60 +
            time_remaining.seconds;

          setTimeRemainingSeconds(totalSeconds);
        })
        /*{
        "time_remaimning": {
          "days": -1,
          "hours": 23,
          "minutes": 59,
          "seconds": 13
        },
        "login_time": "2024-08-10T22:00:56.088965",
        "current_speed": 0.05602
      } 
      */
        .catch((err) => {
          console.error(err);
          if (err?.response?.data?.message) {
            alert(err.response.data.message);
          }
        });
    }
  }, [statusData]);

  useEffect(() => {
    if (timeRemainingSeconds !== null) {
      const timer = setInterval(() => {
        setTimeRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemainingSeconds]);

  if (!statusData) {
    return <div>Loading...</div>;
  }

  const loginTime = statusData.login_time
    ? new Date(statusData.login_time).toLocaleString()
    : "N/A";

  const days = Math.floor(timeRemainingSeconds / 86400);
  const hours = Math.floor((timeRemainingSeconds % 86400) / 3600);
  const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
  const seconds = timeRemainingSeconds % 60;

  const timeRemainingDisplay =
    days || hours || minutes || seconds
      ? `${days}D ${hours} H ${minutes}m ${seconds}sec`
      : null;

  const currentSpeed =
    statusData.current_speed !== undefined
      ? `${statusData.current_speed} Mbps`
      : "N/A";

  return (
    <div className="status-wrapper">
      <div className="status-box">
        {http.premiumId && <LogoutButton />}
        <h1>Status Page</h1>
        {timeRemainingDisplay ? (
          Prop("Time Remaining", timeRemainingDisplay)
        ) : (
          <p style={{ color: "red", fontWeight: "bold", fontStyle: "italic" }}>
            Session ended
          </p>
        )}
        {Prop("Login Time", loginTime)}
        {Prop("Current Speed", currentSpeed)}
      </div>
    </div>
  );
};

function Prop(title, content) {
  return (
    <div className="status_prop">
      <p className="title">{title}</p>
      <p className="content">{content}</p>
    </div>
  );
}

export default Status;
