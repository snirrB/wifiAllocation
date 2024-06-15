import React, { useState } from "react";
import "./LoginRegister.css";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaCreditCard,
  FaKey,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../Services/api";

const LoginRegister = () => {
  const [action, setAction] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();

  const registerLink = () => {
    setAction(" active");
  };

  const loginLink = () => {
    setAction("");
  };

  const handleGuest = (e) => {
    e.preventDefault();
    navigate("/terms");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await loginService.register(email, password);
      console.log("User registered:", response);
      alert("User registered successfully!");
      navigate("/status", { state: { isPremium: true } });
    } catch (error) {
      console.error("Error registering user:", error.response.data);
      alert("Error registering user.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginService.login(email, password);
      console.log("User logged in:", response);
      alert("User logged in successfully!");
      navigate("/status", { state: { isPremium: true } });
    } catch (error) {
      console.error("Error logging in user:", error.response.data);
      alert("Error logging in user.");
    }
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  return (
    <div className={`wrapper${action}`}>
      <div className="form-box login">
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
            <button className="guest-button" onClick={handleGuest}>
              Continue As Guest
            </button>
          </div>
          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="link-button"
                onClick={registerLink}
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
      <div className="form-box register">
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
      </div>
    </div>
  );
};

export default LoginRegister;
