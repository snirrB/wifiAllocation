import React, { useEffect, useState } from "react";
import "./LoginRegister.css";
import "../../styles/page.css";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./_LoginForm";
import { RegisterForm } from "./_RegisterForm";
import { http } from "../../Services/utils";
import { NO_TOKEN_URL } from "./WaitForToken";

const LoginRegister = () => {
  const [action, setAction] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!http.token) {
      navigate(NO_TOKEN_URL);
    }
  }, [http.token]);

  const registerLink = () => {
    setAction("active");
  };

  const loginLink = () => {
    setAction("");
  };

  return (
    <div className={`wrapper ${action}`}>
      <div className="form-box login">
        <LoginForm registerLink={registerLink} />
      </div>
      <div className="form-box register">
        <RegisterForm loginLink={loginLink} />
      </div>
    </div>
  );
};

export default LoginRegister;
