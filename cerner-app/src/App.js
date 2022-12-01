import StandalonePatientLauncher from "./launchers/StandalonePatientLauncher";
import StandaloneProviderLauncher from "./launchers/StandaloneProviderLauncher";
import ProviderEhrLauncher from "./launchers/ProviderEhrLauncher";
import PatientEhrLauncher from "./launchers/PatientEhrLauncher";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/launch-standalone-provider" element={<StandaloneProviderLauncher />} />
          <Route path="/launch-standalone-patient" element={<StandalonePatientLauncher />} />
          <Route path="/launch-ehr-provider" element={<ProviderEhrLauncher />} />
          <Route path="/launch-ehr-patient" element={<PatientEhrLauncher />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
