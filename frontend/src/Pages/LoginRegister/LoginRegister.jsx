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
import PremiumPricing from "../pricing/pricing";
import { LoginForm } from "./_LoginForm";
import { RegisterForm } from "./_RegisterForm";

const or = <p style={{ marginTop: "-5px", marginBottom: "5px" }}>or</p>;
const option = (text) => (
  <p style={{ fontSize: "small", marginTop: "5px", marginBottom: "-5px" }}>
    {text}
  </p>
);

const LoginRegister = () => {
  const [action, setAction] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   async function getTokenNODOG() {
  //     const result = await axios.get(`${NODOG_URL}/clients`);
  //     console.log("result" , result);
  //   }
  //   getTokenNODOG();
  // }, []);

  const registerLink = () => {
    setAction("active");
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
      const result = await apiService.newPremiumUser(
        email,
        password,
        "30f167e3"
      );
      console.log("Registration successful", result);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await apiService.loginPremiumUser(
        email,
        password,
        "30f167e3"
      );
      console.log("User logged in:", result);
      // navigate("/status", { state: { isPremium: true } });
      navigate("/pricing", { state: { isPremium: true } });
    } catch (error) {
      console.error("Error logging in user:", error.response.data);
    }
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const handlePricing = (e) => {
    e.preventDefault();
    navigate("/pricing", { state: { from: "/" } });
  };

  return (
    <>
      <section
        className="float-top-right top-right-button"
        onClick={handlePricing}
      >
        Our Pricing
      </section>
      <div className={`wrapper ${action}`}>
        <div className="form-box login">
          <LoginForm
            handleLogin={handleLogin}
            handleGuest={handleGuest}
            registerLink={registerLink}
          />
        </div>
        <div className="form-box register">
          <RegisterForm
            handleInput={handleInput}
            handleRegister={handleRegister}
            loginLink={loginLink}
          />
        </div>
        {/* <div className="form-box pricing">
          <PremiumPricing />
        </div> */}
      </div>
    </>
  );
};

export default LoginRegister;
