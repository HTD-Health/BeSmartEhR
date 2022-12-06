import PersonIcon from "@mui/icons-material/Person";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { getUser } from "../../api/api";

const SmartAppBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = await getUser();
    setUser(user);
  };

  const getUserName = () => {
    if (!user || !user.name || user.name.length === 0) {
      return "";
    }
    const name = user.name[0];
    return `${name.prefix[0]} ${name.given[0]} ${name.family}`;
  };

  return (
    <AppBar position="relative">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: "3rem",
          px: "2rem",
        }}
      >
        <Typography variant="h5" color="inherit" noWrap>
          BeSmartEhR - Practitioner App
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PersonIcon sx={{ mr: "0.5rem" }} />
          <Typography variant="h8" color="inherit" noWrap>
            {getUserName()}
          </Typography>
        </Box>
      </Box>
    </AppBar>
  );
};

export default SmartAppBar;
