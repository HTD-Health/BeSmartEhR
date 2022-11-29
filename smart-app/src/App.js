import "./App.css";
import React from "react";
import ProviderStandaloneWrapper from "./components/providerStandalone/ProviderStandaloneWrapper";
import PatientStandaloneWrapper from "./components/patientStandalone/PatientStandaloneWrapper";
import ProviderEHR from "./components/providerEHR/ProviderEHR";

function App() {
  // PATIENT EHR
  // return <PatientEHRWrapper/>;

  // PROVIDER EHR
  // eslint-disable-next-line no-unreachable
  return (<ProviderEHR/>);

  // PATIENT STANDALONE
  // eslint-disable-next-line no-unreachable
  return (<PatientStandaloneWrapper/>);

  // PROVIDER STANDALONE
  // eslint-disable-next-line no-unreachable
  return (<ProviderStandaloneWrapper/>);
}

export default App;
