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
import { QRPopup } from "../../components/QR/QRPopUp";
import { apiService } from "../../Services/api";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ registerLink }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    apiService
      .loginPremiumUser(email, password)
      .then((res) => {
        console.log("User logged in:", res);
        navigate("/pricing", { state: { isPremium: true } });
      })
      .catch((err) => {
        console.error("Error logging in user:", err);
        if (err?.response?.data?.message) {
          alert(err.response.data.message);
        }
      });
  };

  const handleGuest = (e) => {
    e.preventDefault();
    navigate("/terms");
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
