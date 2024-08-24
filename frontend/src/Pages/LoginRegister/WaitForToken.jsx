import React, { useEffect } from "react";
import "./LoginRegister.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { http } from "../../Services/utils";
import { Oval } from "react-loader-spinner";
import Waiter from "../../components/processing screen/processingScreen";

export const NO_TOKEN_URL = "/no-token";

// export const PrivateRoute = ({ element }) => {
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!http.token) {
//       navigate(NO_TOKEN_URL);
//     }
//   }, []);
//   return http.token ? element : <Navigate to={NO_TOKEN_URL} />;
// };

export const WaitingForToken = () => {
  const { token } = useParams();
  const localToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      console.log("token:", token);
      localStorage.setItem("token", token);
      http.setToken(token);
      navigate("/login");
    } else {
      localStorage.removeItem("token");
    }
  }, [token, localToken, navigate]);

  return (
    <div className={`wrapper`} >
      <Waiter text={"Waiting for token"} />
    </div>
  );
};
