import FHIR from "fhirclient";
import React, { useEffect } from "react";
import PatientDataViewer from "../viewers/PatientDataViewer";

const StandalonePatientLauncher = () => {
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      // Cerner Secure Sandbox
      // Patient-scoped
      const client = await FHIR.oauth2.init({
        clientId: process.env.REACT_APP_STANDALONE_PATIENT_CLIENT_ID,
        scope: "patient/Patient.read launch/patient online_access openid profile",
        iss: process.env.REACT_APP_CERNER_SECURED_PATIENT_R4_URL,
        redirectUri: process.env.REACT_APP_STANDALONE_PATIENT_REDIRECT_URI,
      });
      setClient(client);
    } catch (e) {
      setError(e);
    }
  };

  if (error) {
    return (
      <div>
        <h3>Patient Standalone Launch failed</h3>
        <p>error: {error}</p>
      </div>
    );
  }
  if (!client) {
    return <div>Loading...</div>;
  }
  return <PatientDataViewer fhirClient={client} />;
};

export default StandalonePatientLauncher;
