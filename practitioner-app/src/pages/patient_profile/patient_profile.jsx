import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { getPatient } from "../../api/api";
import PatientCard from "../../components/patient_card/patient_card";
import SmartAppBar from "../../components/smart_app_bar/smart_app_bar";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const patient = await getPatient();
    setPatient(patient);
  };

  return (
    <>
      <SmartAppBar />
      <Box
        sx={{
          p: "2rem",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <PatientCard patient={patient} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Button variant="contained" sx={{ my: "0.5rem" }}>
                Assigned Forms
              </Button>
              <Button variant="contained" sx={{ my: "0.5rem" }}>
                Filled Forms
              </Button>
              <Button variant="contained" sx={{ my: "0.5rem" }}>
                Assign a new Form
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PatientProfile;