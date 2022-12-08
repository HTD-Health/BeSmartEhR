import FHIR from "fhirclient";
import { useEffect, useState } from "react";
import { clientId, redirectUrl } from "../common";

export const LaunchPage = () => {
  const [currentPatient, setCurrentPatient] = useState();

  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
        clientId: clientId,
        scope: "launch openid",
        redirectUri: redirectUrl,
      });
      setClient(client);
    } catch (e) {
      setError(e);
    }
  };

  const getUserDetails = async () => {
    const resp = await client.request(`Patient/${client.patient.id}`);
    setCurrentPatient(resp);
  };

  useEffect(() => {
    if (!client) {
      return;
    }
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  if (error) {
    return (
      <div>
        <h3>Patient EHR Launch failed</h3>
        <p>error: {JSON.stringify(error)}</p>
      </div>
    );
  }

  return (
    <div className="App">
      {currentPatient && (
        <div>
          <div>Current Patient:</div>
          <div>
            <span>First Name: </span>
            <span>{currentPatient.name[0].given[0]}</span>
          </div>
          <div>
            <span>Last Name: </span>
            <span>{currentPatient.name[0].family}</span>
          </div>
        </div>
      )}
    </div>
  );
};
