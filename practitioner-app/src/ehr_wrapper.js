import { Container, Typography } from "@mui/material";
import FHIR from "fhirclient";
import React, { useEffect } from "react";
import AppRouter from "./app_router";

const fhirUrlProviderStandAlone = "FHIR_URL";
const client_id = "be-smart-ehr"; // whatever - as smart app launcher ignores this
const client_secret = "completeRandom"; // whatever - as smart app launcher ignores this

const EhrWrapper = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      await FHIR.oauth2.authorize({
        iss: fhirUrlProviderStandAlone,
        clientId: client_id,
        clientSecret: client_secret,
        scope: "launch/provider openid profile",
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
