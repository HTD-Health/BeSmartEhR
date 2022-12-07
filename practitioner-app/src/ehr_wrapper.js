import { Container, Typography } from "@mui/material";
import FHIR from "fhirclient";
import { useEffect, useState } from "react";
import AppRouter from "./app_router";

const EhrWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    smartLaunch();
  }, []);

  const smartLaunch = async () => {
    try {
      await FHIR.oauth2.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: process.env.REACT_APP_CLIENT_SCOPE,
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
