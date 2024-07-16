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

export const RegisterForm = ({ handleRegister, handleInput, loginLink }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <form onSubmit={handleRegister}>
      <h1>Registration</h1>
      <div className="input-box">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FaUser className="icon" />
      </div>
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
      <div className="input-box">
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          maxLength="16"
          onChange={(e) => setCardNumber(e.target.value)}
          onInput={handleInput}
          required
        />
        <FaCreditCard className="icon" />
      </div>
      <div className="input-row">
        <div className="input-box custom-date-input">
          <input
            type="month"
            placeholder="Expiry Date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
          <span className="icon">
            <i className="fa fa-calendar"></i>
          </span>
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            maxLength="3"
            onChange={(e) => setCvv(e.target.value)}
            onInput={handleInput}
            required
          />
          <span className="icon cvv-icon">
            <FaKey className="icon" />
          </span>
        </div>
      </div>
      <button type="submit" className="register-button">
        Register
      </button>
      <div className="register-link">
        <p>
          Already have an account?{" "}
          <button type="button" className="link-button" onClick={loginLink}>
            Login
          </button>
        </p>
      </div>
    </form>
  );
};
