import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const SmartAppBar = () => {
  return (
    <AppBar position="relative">
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        py: "3rem",
      }}>
        <Typography variant="h6" color="inherit" noWrap>
          BeSmartEhR - Practitioner App
        </Typography>
      </Box>
    </AppBar>
  );
};

export default SmartAppBar;
