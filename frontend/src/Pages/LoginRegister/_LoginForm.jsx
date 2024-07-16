import React, { useState /*, useEffect*/ } from "react";
import "./LoginRegister.css";
import "../../styles/page.css";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaCreditCard,
  FaKey,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../Services/api";
import { QRPopup } from "../../components/QR/QRPopUp";

export const LoginForm = ({ handleLogin, handleGuest, registerLink }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <div className="input-box">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FaEnvelope className="icon" />
      </div>
      <div className="input-box">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FaLock className="icon" />
      </div>
      <div className="button-container">
        <button type="submit" className="login-button">
          Login
        </button>
        <button type="button" className="login-button" onClick={openPopup}>
          Login With QR Code
        </button>
        <QRPopup isOpen={isPopupOpen} onClose={closePopup} />
        <button className="guest-button" onClick={handleGuest}>
          Continue As Guest
        </button>
      </div>
      <div className="register-link">
        <p>
          Don't have an account?{" "}
          <button type="button" className="link-button" onClick={registerLink}>
            Register
          </button>
        </p>
      </div>
    </form>
  );
};
