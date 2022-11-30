import StandaloneLauncher from "./launchers/StandaloneLauncher";
import ProviderEhrLauncher from "./launchers/ProviderEhrLauncher";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/launch-standalone" element={<StandaloneLauncher />} />
          <Route path="/launch-ehr" element={<ProviderEhrLauncher />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
