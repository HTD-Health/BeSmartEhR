import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MasterPage from "./pages/MasterPage";
import HomePage from "./pages/HomePage";
import PatientEHRPage from "./pages/PatientEHRPage";
import PatientStandalonePage from "./pages/PatientStandalonePage";
import ProviderEHRPage from "./pages/ProviderEHRPage";
import ProviderStandalonePage from "./pages/ProviderStandalonePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MasterPage />}>
          <Route index element={<HomePage />} />
          <Route path="patientEHR" element={<PatientEHRPage />} />
          <Route path="patientSA" element={<PatientStandalonePage />} />
          <Route path="providerEHR" element={<ProviderEHRPage />} />
          <Route path="providerSA" element={<ProviderStandalonePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
