import FHIR from "fhirclient";
import { useEffect, useState } from "react";
import { clientId, redirectUrl, useQuery } from "../common";

export const LaunchPage = () => {
  const query = useQuery();

  const [patients, setPatients] = useState();
  const [currentPatient, setCurrentPatient] = useState();

  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
        // iss: iss,
        clientId: clientId,
        // launch: launch,
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
    const resp = await client.request(`Patient/${client.patient.id}`);
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
        <h3>Patient EHR Launch failed</h3>
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
          <br />
          {patients && (
            <div>
              <div>{`Patients fetched [${patients.entry.length}]:`}</div>
              {patients.entry.map((item) => (
                <div key={item.resource.id}>
                  <p>{`${item.resource.resourceType}/${item.resource.id}`}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
