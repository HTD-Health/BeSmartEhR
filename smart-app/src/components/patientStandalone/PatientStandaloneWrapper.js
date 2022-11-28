import FHIR from "fhirclient";
import React, { useEffect } from "react";
import PatientStandalone from "./PatientStandalone";

const fhirUrlPatientStandAlone =
  "https://launch.smarthealthit.org/v/r4/sim/eyJrIjoiMSIsImoiOiIxIiwiYiI6Ijg3YTMzOWQwLThjYWUtNDE4ZS04OWM3LTg2NTFlNmFhYjNjNiJ9/fhir";
const client_id = "be-smart-ehr"; // whatever - as smart app launcher ignores this
const client_secret = "completeRandom"; // whatever - as smart app launcher ignores this

const PatientStandaloneWrapper = () => {
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
        iss: fhirUrlPatientStandAlone,
        clientId: client_id,
        clientSecret: client_secret,
        scope: "launch/patient openid profile",
      });
      setClient(client);
    } catch (e) {
      setError(e)
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
  return <PatientStandalone fhirClient={client}/>;
};

export default PatientStandaloneWrapper;
