import React from "react";
import { useNavigate } from "react-router-dom";
import "./Terms.css";
import { apiService } from "../../Services/api";

const Terms = () => {
  const navigate = useNavigate();

  const handleApprove = async () => {
    const token = "be3e4d99";
    const result = await apiService.loginFreeUser(token);
    console.log("result", result);
    navigate("/status/free", { state: { isPremium: false } });
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="terms-wrapper">
      <div className="terms-box">
        <h1>Terms and Conditions</h1>
        <p>
          {" "}
          1. As a free user, you agree to receive advertisements while using our
          service.
        </p>
        <p>
          {" "}
          2. Network access for free users is subject to availability. If the
          network is full, you may not be able to connect.
        </p>
        <div className="button-container">
          <button className="approve-button" onClick={handleApprove}>
            Approve
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
