import FHIR from "fhirclient";
import { useEffect, useMemo, useState } from "react";
import { clientId, fhirUrl, redirectUrl, useQuery } from "../common";

export const StandalonePage = () => {
  const [currentPatient, setCurrentPatient] = useState();

  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  const query = useQuery();
  const code = useMemo(() => query.get("code"), [query]);

  useEffect(() => {
    if (!code) {
      return;
    }
    smartLaunch();
  }, [code]);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
        iss: fhirUrl,
        clientId: clientId,
        scope: "launch patient/*.read openid profile offline_access",
        redirectUri: redirectUrl,
      });
      setClient(client);
    } catch (e) {
      setError(e);
      console.log(e);
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
        <h3>Patient Standalone Launch failed</h3>
        <p>error: {JSON.stringify(error)}</p>
      </div>
    );
  }

  return (
    <div className="App">
      {!client && <button onClick={smartLaunch}>Sign in</button>}
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
