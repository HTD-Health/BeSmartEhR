import FHIR from "fhirclient";
import React, { useEffect } from "react";
import ProviderEHR from "./ProviderEHR";

const client_id = "be-smart-ehr"; // whatever - as smart app launcher ignores this
const iss = "asdads"; // depends on launch context

const ProviderEHRWrapper = () => {
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      const client = await FHIR.oauth2.init({
        clientId: client_id,
        scope: "launch launch/provider openid profile",
      });

      console.log(client);

      setClient(client);
    } catch (e) {
      setError(e);
    }
  };

  if (error) {
    return (
      <div>
        <h3>Provider EHR Launch failed</h3>
        <p>error: {error}</p>
      </div>
    );
  }
  if (!client) {
    return <div>Loading...</div>;
  }
  return <ProviderEHR fhirClient={client} />;
};

export default ProviderEHRWrapper;
