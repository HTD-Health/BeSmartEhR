import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import FHIR from "fhirclient";

const fhirUrl =
  "https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImUiOiJlNDQzYWM1OC04ZWNlLTQzODUtOGQ1NS03NzVjMWI4ZjNhMzcifQ/fhir";
const client_id = "be-smart-ehr";

const root = ReactDOM.createRoot(document.getElementById("root"));

const smartLaunch = () => {
  // Authorize application
  FHIR.oauth2
    .init({
      iss: fhirUrl,
      clientId: client_id,
      scope: "launch/provider openid profile",
    })
    .then((client) => {
      root.render(
        <React.StrictMode>
          <App client={client} />
        </React.StrictMode>
      );
    })
    .catch(console.log);
};

smartLaunch();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
