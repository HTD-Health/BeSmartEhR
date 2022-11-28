import "./App.css";
import React from "react";
import ProviderStandaloneWrapper from "./components/providerStandalone/ProviderStandaloneWrapper";

function App() {
  // Here we want to switch between different launch scenarios
  return (<ProviderStandaloneWrapper/>);
}

export default App;
