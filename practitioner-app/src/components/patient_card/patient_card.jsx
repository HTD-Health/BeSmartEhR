import { Box, Card, Typography } from "@mui/material";

const PatientCard = () => {
  return (
    <>
      <Card sx={{ p: "1rem" }}>
        <Typography variant="h6" color="inherit" noWrap>
          Robert Maklovicz
        </Typography>
        <Typography variant="h8" color="inherit" noWrap>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            Age:{" "}
          </Box>
          50 <br />
          <Box component="span" sx={{ fontWeight: "bold" }}>
            Gender:{" "}
          </Box>
          male
          <br />
          <Box component="span" sx={{ fontWeight: "bold" }}>
            Height:{" "}
          </Box>
          160cm
          <br />
          <Box component="span" sx={{ fontWeight: "bold" }}>
            Weight:{" "}
          </Box>
          90kg
          <br />
        </Typography>
      </Card>
    </>
  );
};

export default PatientCard;
