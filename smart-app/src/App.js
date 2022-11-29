import "./App.css";
import React from "react";
import ProviderStandaloneWrapper from "./components/providerStandalone/ProviderStandaloneWrapper";
import PatientStandaloneWrapper from "./components/patientStandalone/PatientStandaloneWrapper";
import ProviderEHRWrapper from "./components/providerEHR/ProviderEHRWrapper";
import PatientEHRWrapper from "./components/patientEHR/PatientEHRWrapper";

function App() {
  // PATIENT EHR
  return <PatientEHRWrapper/>;

  // PROVIDER EHR
  // eslint-disable-next-line no-unreachable
  return (<ProviderEHRWrapper/>);

  // PATIENT STANDALONE
  // eslint-disable-next-line no-unreachable
  return (<PatientStandaloneWrapper/>);

  // PROVIDER STANDALONE
  // eslint-disable-next-line no-unreachable
  return (<ProviderStandaloneWrapper/>);
}

export default App;
