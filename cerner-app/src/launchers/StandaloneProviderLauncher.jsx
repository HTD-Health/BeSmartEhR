import FHIR from "fhirclient";
import React, { useEffect } from "react";
import PatientDataViewer from "../viewers/PatientDataViewer";

const StandaloneProviderLauncher = () => {
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      // Cerner Secure Sandbox
      // Non-Patient
      const client = await FHIR.oauth2.init({
        clientId: process.env.REACT_APP_STANDALONE_PROVIDER_CLIENT_ID,
        scope: "user/Patient.read user/Practitioner.read launch/patient online_access openid profile",
        iss: process.env.REACT_APP_CERNER_SECURED_NON_PATIENT_R4_URL,
        redirectUri: process.env.REACT_APP_STANDALONE_PROVIDER_REDIRECT_URI,
      });
      console.log(client)

      // Cerner Open Sandbox
      // https://fhir.cerner.com/millennium/r4/#open-sandbox
      //   const client = await FHIR.oauth2.init({
      //     clientId: "nothing-interesting",
      //     scope: "user/Patient.read launch/patient online_access openid profile",
      //     iss: process.env.REACT_APP_CERNER_OPEN_R4_URL,
      //     redirectUri: process.env.REACT_APP_STANDALONE_REDIRECT_URI,
      //     patientId: "xxxxxx"
      // });
      setClient(client);
    } catch (e) {
      setError(e);
    }
  };

  if (error) {
    return (
      <div>
        <h3>Provider Standalone Launch failed</h3>
        <p>error: {error}</p>
      </div>
    );
  }
  if (!client) {
    return <div>Loading...</div>;
  }
  return <PatientDataViewer fhirClient={client} />;
};

export default StandaloneProviderLauncher;
