import FHIR from "fhirclient";
import React, { useEffect } from "react";
import ProviderStandalone from "./ProviderStandalone";

const fhirUrlProviderStandAlone =
  "https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImUiOiJlNDQzYWM1OC04ZWNlLTQzODUtOGQ1NS03NzVjMWI4ZjNhMzcifQ/fhir";
const client_id = "be-smart-ehr"; // whatever - as smart app launcher ignores this
const client_secret = "completeRandom"; // whatever - as smart app launcher ignores this

const ProviderStandaloneWrapper = () => {
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
        iss: fhirUrlProviderStandAlone,
        clientId: client_id,
        clientSecret: client_secret,
        scope: "launch/provider openid profile",
      });
      setClient(client);
    } catch (e) {
      setError(e)
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
  return <ProviderStandalone fhirClient={client}/>;
};

export default ProviderStandaloneWrapper;
