import { Container, Typography } from "@mui/material";
import FHIR from "fhirclient";
import { useEffect, useState } from "react";
import AppRouter from "./app_router";

// TODO: export to env file
const fhirUrlProviderStandAlone =
  "http://launch.smarthealthit.org/v/r4/sim/WzIsImQ2NGIzN2Y1LWQzYjUtNGMyNS1hYmU4LTIzZWJlOGY1YTA0ZSIsImYyNTZkM2JhLWJiNzAtNDYxMy1hNjMxLTgyNWQ1MDBjNTdmYSIsIkFVVE8iLDAsMCwwLCIiLCIiLCIiLCIiLCIiLCIiLCIiLDAsMV0/fhir";
const client_id = "be-smart-ehr"; // whatever - as smart app launcher ignores this
const client_secret = "completeRandom"; // whatever - as smart app launcher ignores this
const scope = "launch/provider openid profile";

const EhrWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      await FHIR.oauth2.init({
        iss: fhirUrlProviderStandAlone,
        clientId: client_id,
        clientSecret: client_secret,
        scope: scope,
      });
      setLoading(false);
    } catch (e) {
      setError(e);
    }
  };

  if (error) {
    return (
      <Container>
        <Typography variant="h6">Provider Standalone Launch failed</Typography>
        <Typography variant="h8">error: {error}</Typography>
      </Container>
    );
  }
  if (loading) {
    return (
      <Container>
        <Typography variant="h8">Loading...</Typography>
      </Container>
    );
  }
  return <AppRouter />;
};

export default EhrWrapper;
