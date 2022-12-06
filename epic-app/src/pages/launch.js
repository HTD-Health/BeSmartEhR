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

const examplePatient = {
  resourceType: "Patient",
  id: "erXuFYUfucBZaryVksYEcMg3",
  extension: [
    {
      extension: [
        {
          valueCoding: {
            system: "urn:oid:2.16.840.1.113883.6.238",
            code: "2131-1",
            display: "Other Race",
          },
          url: "detailed",
        },
        {
          valueString: "Other",
          url: "text",
        },
      ],
      url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
    },
    {
      extension: [
        {
          valueString: "Unknown",
          url: "text",
        },
      ],
      url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
    },
    {
      valueCodeableConcept: {
        coding: [
          {
            system:
              "urn:oid:1.2.840.114350.1.13.0.1.7.10.698084.130.657370.19999000",
            code: "female",
            display: "female",
          },
        ],
      },
      url: "http://open.epic.com/FHIR/StructureDefinition/extension/legal-sex",
    },
    {
      valueCode: "F",
      url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
    },
  ],
  active: true,
  name: [
    {
      use: "official",
      text: "Camila Maria Lopez",
      family: "Lopez",
      given: ["Camila", "Maria"],
    },
    {
      use: "usual",
      text: "Camila Maria Lopez",
      family: "Lopez",
      given: ["Camila", "Maria"],
    },
  ],
  telecom: [
    {
      system: "phone",
      value: "469-555-5555",
      use: "home",
    },
    {
      system: "phone",
      value: "469-888-8888",
      use: "work",
    },
    {
      system: "email",
      value: "knixontestemail@epic.com",
    },
  ],
  gender: "female",
  birthDate: "1987-09-12",
  deceasedBoolean: false,
  address: [
    {
      use: "old",
      line: ["3268 West Johnson St.", "Apt 117"],
      city: "GARLAND",
      district: "DALLAS",
      state: "TX",
      postalCode: "75043",
      country: "US",
    },
    {
      use: "home",
      line: ["3268 West Johnson St.", "Apt 117"],
      city: "GARLAND",
      district: "DALLAS",
      state: "TX",
      postalCode: "75043",
      country: "US",
      period: {
        start: "2019-05-24",
      },
    },
  ],
  maritalStatus: {
    text: "Married",
  },
  communication: [
    {
      language: {
        coding: [
          {
            system: "urn:ietf:bcp:47",
            code: "en",
            display: "English",
          },
        ],
        text: "English",
      },
      preferred: true,
    },
  ],
  generalPractitioner: [
    {
      reference: "Practitioner/eM5CWtq15N0WJeuCet5bJlQ3",
      type: "Practitioner",
      display: "Family Medicine Physician, MD",
    },
  ],
  managingOrganization: {
    reference: "Organization/enRyWnSP963FYDpoks4NHOA3",
    display: "EHS Service Area",
  },
};

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
    return; // todo: remove
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
      {examplePatient && (
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
                  <span>{examplePatient.name[0].text}</span>
                </div>
                <div>
                  <span>Gender: </span>
                  <span>{examplePatient.gender}</span>
                </div>
                <div>
                  <span>Birth date: </span>
                  <span>{examplePatient.birthDate}</span>
                </div>
                <div>
                  <span>Address: </span>
                  <span>
                    {
                      examplePatient.address.find((x) => x.use === "home")
                        .line[0]
                    }
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
