import FHIR from "fhirclient";
import React, { useEffect } from "react";
import PatientDataViewer from "../viewers/PatientDataViewer";

const PatientEhrLauncher = () => {
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
        clientId: process.env.REACT_APP_EHR_PATIENT_CLIENT_ID,
        scope: "user/Patient.read launch online_access openid profile",
        redirectUri: process.env.REACT_APP_EHR_PATIENT_REDIRECT_URI,
      });

      console.log(client)

      setClient(client);
    } catch (e) {
      setError(e);
    }
  };

  if (error) {
    return (
      <div>
        <h3>Patient EHR Launch failed</h3>
        <p>error: {error}</p>
      </div>
    );
  }
  if (!client) {
    return <div>Loading...</div>;
  }
  return <PatientDataViewer fhirClient={client} />;
};

export default PatientEhrLauncher;
