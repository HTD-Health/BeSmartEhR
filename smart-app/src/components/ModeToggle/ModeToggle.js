import React, { useEffect } from "react";
import PatientEHRWrapper from "../patientEHR/PatientEHRWrapper";

const ModeToggle = () => {
  //const [client, setClient] = React.useState(null);

  useEffect(() => {

    console.log("mode toggle...");

  }, []);

  return (
    // PATIENT EHR
    <PatientEHRWrapper />

    // PROVIDER EHR
    // eslint-disable-next-line no-unreachable
    // <ProviderEHRWrapper/>

    // PATIENT STANDALONE
    // eslint-disable-next-line no-unreachable
    // <PatientStandaloneWrapper/>

    // PROVIDER STANDALONE
    // eslint-disable-next-line no-unreachable
    // <ProviderStandaloneWrapper/>
  );
};

export default ModeToggle;
