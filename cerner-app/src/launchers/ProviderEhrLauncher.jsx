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
        clientId: process.env.REACT_APP_EHR_APP_CLIENT_ID,
        scope: "online_access openid profile launch user/Practitioner.read user/Patient.read patient/Patient.read",
        redirectUri: process.env.REACT_APP_EHR_REDIRECT_URI,
      });

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
