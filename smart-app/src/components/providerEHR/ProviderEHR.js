import { useEffect } from "react";
import React from "react";
import jwt_decode from "jwt-decode";
import FHIR from "fhirclient";

const ProviderEHR = () => {
  const [patients, setPatients] = React.useState(null);
  const [practitioner, setPractitioner] = React.useState(null);
  const [scope, setScope] = React.useState(null);

  useEffect(() => {
    getData();
    // getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    try {
      const fhirClient = await FHIR.oauth2.ready()
      const resp = await fhirClient.request("Patient")
      setPatients(resp);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserDetails = async () => {
    const fhirClient = await FHIR.oauth2.ready()

    const scope = fhirClient.state.tokenResponse.scope;
    setScope(scope);

    console.log(fhirClient.state)
    const token = fhirClient.state.tokenResponse.id_token;
    const decoded = jwt_decode(token)

    console.log(fhirClient)

    const resp = await fhirClient.request(decoded.fhirUser)
    setPractitioner(resp);
  }

  return (
    <div className="App">
      <strong>BeSmartEhR</strong>
      <div>Logged as: {practitioner && (practitioner.name[0].given[0] + " " + practitioner.name[0].family) }</div>
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
export default ProviderEHR;
