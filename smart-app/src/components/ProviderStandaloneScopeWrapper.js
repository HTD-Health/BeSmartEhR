import FHIR from "fhirclient";
import React from "react";

import ProviderStandaloneScope from "./ProviderStandaloneScope";

const fhirUrlProviderStandAlone =
  "https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImUiOiJlNDQzYWM1OC04ZWNlLTQzODUtOGQ1NS03NzVjMWI4ZjNhMzcifQ/fhir";
const client_id = "be-smart-ehr"; // whatever - as smart app launcher ignores this
const client_secret = "completeRandom"; // whatever - as smart app launcher ignores this

const ProviderStandaloneScopeWrapper = () => {
  const smartLaunch = () => {

    console.log('smart launching');

    FHIR.oauth2
      .init({
        iss: fhirUrlProviderStandAlone,
        clientId: client_id,
        clientSecret: client_secret,
        scope: "launch/provider openid profile",
      })
      .then((client) => {
        return (
          <ProviderStandaloneScope client={client}></ProviderStandaloneScope>
        );
      })
      .catch(console.log);
  };

  return smartLaunch();
};

export default ProviderStandaloneScopeWrapper;
