import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft as BackIcon,
  FaArrowRight as LogoutIcon,
} from "react-icons/fa";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import { apiService } from "../../Services/api";

import "./buttons.css";

export const BackButton = ({ to }) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };
  return (
    <section className="back-button" onClick={handleClick}>
      <BackIcon />
      <h4>Back</h4>
    </section>
  );
};

export const LogoutButton = () => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    apiService.logoutPremiumUser().then(() => {
      navigate("/");
    });
  };
  return (
    <section className="back-button" onClick={handleClick}>
      <FontAwesomeIcon className="reverse-hor" icon={faArrowRightFromBracket} />{" "}
      <h4>Logout</h4>
    </section>
  );
};
