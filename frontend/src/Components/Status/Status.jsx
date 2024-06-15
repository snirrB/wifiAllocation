import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Status.css";
import { dataService } from "../../Services/api";

const Status = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(undefined);
  const [count, setCount] = useState(-1);

  const getStatus = async () => {
    return await dataService.getStatus();
  };

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/");
  };

  // const counter = () => {};

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    getStatus().then((val) => {
      setStatus(val);
      setCount(val.time_remaimning);
    });
  }, []);
  useEffect(() => {
    if (count === undefined) return;
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1000;
      });
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [count]);

  const sectionStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  };
  return (
    <div className="status-wrapper">
      <div className="status-box">
        {!!status && (
          <>
            {status.isPremium && (
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            )}
            <h1>Status</h1>
            <section style={sectionStyle}>
              <h4>User:</h4>
              <p>
                {status.name}
                {status.isPremium && <b>(Premium)</b>}
              </p>
            </section>
            {count > -1 && (
              <section style={sectionStyle}>
                <h4>Time until logout:</h4>
                <p>{formatTime(count)}</p>
              </section>
            )}
            <section style={sectionStyle}>
              <h4>Network speed:</h4>
              <p>{status.current_speed} MB / sec</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Status;
