import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Terms.css";
import { apiService } from "../../Services/api";
import { http } from "../../Services/utils";
import { NO_TOKEN_URL } from "../LoginRegister/WaitForToken";

const Terms = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!http.token) {
      navigate(NO_TOKEN_URL);
    }
  }, [http.token]);

  const handleApprove = () => {
    apiService
      .loginFreeUser(http.token)
      .then((result) => {
        console.log("result", result);
        navigate("/status/free", { state: { isPremium: false } });
      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.data?.message) {
          alert(err.response.data.message);
        }
      });
  };

  const handleCancel = () => {
    navigate("/login");
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
