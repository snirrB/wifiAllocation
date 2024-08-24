import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginRegister from "./Pages/LoginRegister/LoginRegister";
import Terms from "./Pages/Terms/Terms";
import Status from "./Pages/Status/Status";
import PremiumPricing from "./Pages/pricing/pricing";
import FreeUserStatus from "./Pages/Status/FreeUserStatus";
import { http } from "./Services/utils";
import {
  NO_TOKEN_URL,
  WaitingForToken,
} from "./Pages/LoginRegister/WaitForToken";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/waiting-for-token" element={<WaitingForToken />} /> */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/status/free" element={<FreeUserStatus />} />
        <Route path="/status" element={<Status />} />
        <Route path="/pricing" element={<PremiumPricing />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path={NO_TOKEN_URL} element={<WaitingForToken />} />
        <Route path="/:token" element={<WaitingForToken />} />
        <Route path="/" element={<WaitingForToken />} />
      </Routes>
    </Router>
  );
};

export default App;
