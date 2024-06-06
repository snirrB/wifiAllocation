import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./Components/LoginRegister/LoginRegister";
import Terms from "./Components/Terms/Terms";
import Status from "./Components/Status/Status";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </Router>
  );
};

export default App;