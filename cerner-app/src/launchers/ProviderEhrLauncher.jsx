import FHIR from "fhirclient";
import React, { useEffect } from "react";
import PatientDataViewer from "../viewers/PatientDataViewer";

const ProviderEhrLauncher = () => {
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
        clientId: process.env.REACT_APP_EHR_PROVIDER_CLIENT_ID,
        scope: "user/Patient.read user/Practitioner.read launch openid profile",
        redirectUri: process.env.REACT_APP_EHR_PROVIDER_REDIRECT_URI,
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
        <h3>Provider EHR Launch failed</h3>
        <p>error: {error}</p>
      </div>
    );
  }
  if (!client) {
    return <div>Loading...</div>;
  }
  return <PatientDataViewer fhirClient={client} />;
};

export default ProviderEhrLauncher;
