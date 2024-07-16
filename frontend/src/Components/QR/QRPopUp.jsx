import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { apiService } from "../../Services/api";
import { FaTimes as CloseIcon } from "react-icons/fa";
import "./QRPopUp.css";
import "../../styles/utils.css";

export const QRPopup = ({ isOpen, onClose }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    apiService.getQrToken().then((_token) => {
      setToken(_token);
    });
  }, []);

  const handleScan = () => {
    // Placeholder for handling scan action
    alert("QR code scanned!");
    onClose(); // Close popup after scanning
  };

  return (
    <div className={`popup ${isOpen ? "open" : ""}`}>
      <div className="popup-inner">
        {/* <button className="close-btn" onClick={onClose}>
          Close
        </button> */}
        <span className="flex-row-right">
          <CloseIcon style={{ color: "black" }} onClick={onClose} />
        </span>
        <p className="note">Scan QR Code to Login</p>

        {token && <QRCode value={token} />}

        <p className="note">Waiting for scanning ...</p>
      </div>
    </div>
  );
};
