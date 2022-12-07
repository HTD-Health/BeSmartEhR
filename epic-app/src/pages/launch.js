import {
  AppBar,
  Button,
  Card,
  CardContent,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { clientId, redirectUrl, useQuery } from "../common";

export const LaunchPage = () => {
  const query = useQuery();
  const [endpoints, setEndpoints] = useState();

  const [accessToken, setAccessToken] = useState();
  const [patient, setPatient] = useState();
  const [patientData, setPatientData] = useState();

  const launch = useMemo(() => query.get("launch"), [query]);
  const iss = useMemo(() => query.get("iss"), [query]);
  const code = useMemo(() => query.get("code"), [query]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/metadata",
        {
          headers: {
            Accept: "application/fhir+json",
            "Epic-Client-ID": clientId,
          },
        }
      );

      const data = response.data;
      const rest = data.rest.find((entry) => entry?.mode === "server");
      const oauthUris = rest.security.extension.find(
        (entry) =>
          entry.url ===
          "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris"
      );

      const endpoints = oauthUris.extension;
      const authorizeUri = endpoints.find(
        (entry) => entry.url === "authorize"
      )?.valueUri;
      const tokenUri = endpoints.find(
        (entry) => entry.url === "token"
      )?.valueUri;

      setEndpoints({
        authorize: authorizeUri,
        token: tokenUri,
      });
    })();
  }, []);

  useEffect(() => {
    if (!endpoints || !launch || !iss) {
      return;
    }

    (async () => {
      const params = new URLSearchParams();
      params.append("response_type", "code");
      params.append("client_id", clientId);
      params.append("redirect_uri", redirectUrl);
      params.append("scope", "launch");
      params.append("launch", launch);
      params.append(
        "aud",
        "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4"
      );
      params.append("state", "1234");

      window.location.replace(
        `${endpoints["authorize"]}/?${params.toString()}`
      );
    })();
  }, [endpoints, launch]);

  useEffect(() => {
    if (!endpoints || !code) {
      return;
    }

    (async () => {
      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", redirectUrl);
      params.append("code", code);
      params.append("client_id", clientId);
      params.append("state", "1234");

      const response = await axios.post(endpoints["token"], params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setPatient(response.data.patient);
      setAccessToken(response.data.access_token);
    })();
  }, [endpoints, code]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    (async () => {
      const response = await axios.get(
        `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/${patient}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setPatientData(response.data);
    })();
  }, [accessToken]);

  return (
    <div className="App">
      {patientData && (
        <>
          <AppBar position="static" style={{ marginBottom: 20 }}>
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit" component="div">
                BeSmartEhR - Dashboard
              </Typography>
            </Toolbar>
          </AppBar>
          <Container sx={{ display: "flex" }}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <div>
                  <span>Full name: </span>
                  <span>{patientData.name[0].text}</span>
                </div>
                <div>
                  <span>Gender: </span>
                  <span>{patientData.gender}</span>
                </div>
                <div>
                  <span>Birth date: </span>
                  <span>{patientData.birthDate}</span>
                </div>
                <div>
                  <span>Address: </span>
                  <span>
                    {patientData.address.find((x) => x.use === "home").line[0]}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Container sx={{ display: "flex", flexFlow: "column" }}>
              <Button variant="contained">Assigned forms</Button>
              <Button variant="outlined">Already filled forms</Button>
            </Container>
          </Container>
        </>
      )}
    </div>
  );
};
