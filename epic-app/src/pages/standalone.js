import FHIR from "fhirclient";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { clientId, fhirUrl, redirectUrl } from "../common";

export const StandalonePage = () => {
  const [patients, setPatients] = useState();
  const [currentPatient, setCurrentPatient] = useState();

  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
        iss: fhirUrl,
        clientId: clientId,
        // grant_type: "authorization_code",
        // clientSecret: client_secret,
        // scope: "launch/patient openid profile",
        redirectUri: redirectUrl,
      });
      setClient(client);
    } catch (e) {
      setError(e);
    }
  };

  const getData = async () => {
    try {
      const resp = await client.request("Patient");
      setPatients(resp);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserDetails = async () => {
    const token = client.state.tokenResponse.id_token;
    const decoded = jwt_decode(token);

    const resp = await client.request(decoded.fhirUser);
    setCurrentPatient(resp);
  };

  useEffect(() => {
    if (!client) {
      return;
    }
    getData();
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  if (error) {
    return (
      <div>
        <h3>Patient Standalone Launch failed</h3>
        <p>error: {error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <button onClick={smartLaunch}>Sign in</button>
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
          <div>
            <div>Patients fetched:</div>
            {patients &&
              patients.entry.map((patient) => (
                <div key={patient.resource.id}>
                  <p>{patient.resource.id}</p>
                  <p>
                    {patient.resource.name[0].given[0]}{" "}
                    {patient.resource.name[0].family}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
