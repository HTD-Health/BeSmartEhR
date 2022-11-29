import FHIR from "fhirclient";
import React, { useEffect } from "react";
import PatientEHR from "./PatientEHR";

const client_id = "be-smart-ehr"; // whatever - as smart app launcher ignores this
const client_secret = "completeRandom"; // whatever - as smart app launcher ignores this

const PatientEHRWrapper = () => {
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
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
        <h3>Patient EHR Launch failed</h3>
        <p>error: {error}</p>
      </div>
    );
  }
  if (!client) {
    return <div>Loading...</div>;
  }
  return <PatientEHR fhirClient={client}/>;
};

export default PatientEHRWrapper;
