import { useEffect } from "react";
import React from "react";
import jwt_decode from "jwt-decode";

const PatientStandalone = ({fhirClient}) => {
  const [patients, setPatients] = React.useState(null);
  const [currentPatient, setCurrentPatient] = React.useState(null);
  const [scope, setScope] = React.useState(null);

  useEffect(() => {
    getData();
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fhirClient]);

  const getData = async () => {
    try {
      const resp = await fhirClient.request("Patient")
      setPatients(resp);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserDetails = async () => {
    const scope = fhirClient.state.tokenResponse.scope;
    setScope(scope);

    const token = fhirClient.state.tokenResponse.id_token;
    const decoded = jwt_decode(token)

    const resp = await fhirClient.request(decoded.fhirUser)
    setCurrentPatient(resp);
  }

  return (
    <div className="App">
      <strong>BeSmartEhR</strong>
      <div>Logged as: {currentPatient && (currentPatient.name[0].given[0] + " " + currentPatient.name[0].family) }</div>
      <div>scope: {scope}</div>
      <br/>
      <div >
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
  );
};
export default PatientStandalone;
