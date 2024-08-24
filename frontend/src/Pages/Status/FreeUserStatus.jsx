import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiService } from "../../Services/api";
import { FaArrowRight } from "react-icons/fa";

import "../../styles/page.css";
import "./Status.css";

import { BackButton } from "../../components/buttons/buttons";
import Status from "./Status";
import VideoAdvertisement from "../../components/advertisement/ad";

import { NO_TOKEN_URL } from "../LoginRegister/WaitForToken";
import { http } from "../../Services/utils";

const FreeUserStatus = () => {
  const location = useLocation();
  const from = location.state?.from || "/login";
  const [adCountdown, setAdCountdown] = useState(10);
  const [showStatus, setShowStatus] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!http.token) {
      navigate(NO_TOKEN_URL);
    }
  }, [http.token]);

  function handleAfterAd(e) {
    e.preventDefault();
    setShowStatus(true);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (adCountdown > 0) {
        setAdCountdown((prevSeconds) => prevSeconds - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [adCountdown]);

  return showStatus ? (
    <Status />
  ) : (
    <div className="main-wrapper">
      <div className="main-box">
        <BackButton to={from} />
        <h1>Advertisement</h1>
        <section className="flex-row-center no-margin">
          {adCountdown !== 0 ? (
            <section className="ad-skip disabled">
              Ad ends in {adCountdown}
            </section>
          ) : (
            <section className="ad-skip" onClick={handleAfterAd}>
              Continue
            </section>
          )}
        </section>
        <br />
        <VideoAdvertisement />
      </div>
    </div>
  );
};

export default FreeUserStatus;
