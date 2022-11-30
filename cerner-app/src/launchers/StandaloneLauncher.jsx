import FHIR from "fhirclient";
import React, { useEffect } from "react";
import PatientDataViewer from "../viewers/PatientDataViewer";

const StandaloneLauncher = () => {
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      // Cerner Secure Sandbox
      // Patient-scoped
      // const patientId = "12724065";
      // const client = await FHIR.oauth2.init({
      //   clientId: process.env.REACT_APP_STANDALONE_CLIENT_ID,
      //   scope: "user/Patient.read launch/patient online_access openid profile",
      //   redirectUri: process.env.REACT_APP_STANDALONE_REDIRECT_URI,
      //   iss: process.env.REACT_APP_CERNER_SECURED_PATIENT_R4_URL,
      //   patientId,
      // });

      // Cerner Secure Sandbox
      // Non-Patient
      const client = await FHIR.oauth2.init({
        clientId: process.env.REACT_APP_STANDALONE_CLIENT_ID,
        scope:
          "launch/patient online_access openid profile user/Practitioner.read user/Patient.read",
        redirectUri: process.env.REACT_APP_STANDALONE_REDIRECT_URI,
        iss: process.env.REACT_APP_CERNER_SECURED_NON_PATIENT_R4_URL,
      });

      // Cerner Open Sandbox
      // https://fhir.cerner.com/millennium/r4/#open-sandbox
    //   const client = await FHIR.oauth2.init({
    //     clientId: "nothing-interesting",
    //     scope: "user/Patient.read launch/patient online_access openid profile",
    //     iss: process.env.REACT_APP_CERNER_OPEN_R4_URL,
    //     redirectUri: process.env.REACT_APP_STANDALONE_REDIRECT_URI,
    //     patientId
      // });

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

export default StandaloneLauncher;
