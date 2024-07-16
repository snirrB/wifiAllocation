import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./Pages/LoginRegister/LoginRegister";
import Terms from "./Pages/Terms/Terms";
import Status from "./Pages/Status/Status";
import PremiumPricing from "./Pages/pricing/pricing";
import FreeUserStatus from "./Pages/Status/FreeUserStatus";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/status/free" element={<FreeUserStatus />} />
        <Route path="/status" element={<Status />} />
        <Route path="/pricing" element={<PremiumPricing />} />
      </Routes>
    </Router>
  );
};

export default App;
