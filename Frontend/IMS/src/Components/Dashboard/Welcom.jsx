import React, { useEffect, useState } from "react";
import { Box, Card, CardActions, Button, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CodeIcon from "@mui/icons-material/Code";
import axios from "axios";

import publishArticleImage from "./welcome_illustration.svg";

const Welcome = () => {
  const [user, setUser] = useState({});
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");

    if (storedUserId && storedToken) {
      const parsedUserId = JSON.parse(storedUserId).userId;
      const token = JSON.parse(storedToken).token;

      axios
        .get(`${serverHost}/users/${parsedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          setUser(resp.data);
          console.log("User Data:", resp.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  return (
    <Card
      sx={{
        background: (theme) =>
          `linear-gradient(45deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.light} 50%, ${theme.palette.primary.dark} 100%)`,
        color: (theme) => theme.palette.primary.contrastText,
        padding: "30px",
        marginTop: 2,
        marginBottom: "2em",
        minHeight: "250px", // Increased height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: "12px",
        boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
      }}
    >
      <Box display="flex" sx={{ height: "100%" }}>
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Agegn Biomedical Engineering Inventory System
            </Typography>
            <Box maxWidth="60em" mb={3}>
              <Typography variant="h5" component="p" gutterBottom>
                Welcome back,{" "}
                <span style={{ fontWeight: 700 }}>{user.name || "User"}</span>!
              </Typography>
              <Typography
                variant="body1"
                component="p"
                sx={{ fontSize: "1.1rem" }}
              >
                Manage and oversee your inventory system efficiently from this
                dashboard.
              </Typography>
            </Box>
          </Box>

          <CardActions
            sx={{
              padding: { xs: 0, xl: null },
              flexWrap: { xs: "wrap", xl: null },
              "& a": {
                marginTop: { xs: "1em", xl: null },
                marginLeft: { xs: "0!important", xl: null },
                marginRight: { xs: "1em", xl: null },
              },
            }}
          >
            <Button
              variant="contained"
              href="#"
              startIcon={<HomeIcon />}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                padding: "8px 20px",
                fontSize: "1rem",
              }}
            >
              Quick Access
            </Button>
            <Button
              variant="outlined"
              href="#"
              startIcon={<CodeIcon />}
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.5)",
                },
                padding: "8px 20px",
                fontSize: "1rem",
              }}
            >
              System
            </Button>
          </CardActions>
        </Box>
        <Box
          display={{ xs: "none", sm: "none", md: "block" }}
          sx={{
            background: `url(${publishArticleImage}) top right / contain no-repeat`,
            marginLeft: "auto",
            width: "300px",
            height: "200px",
          }}
        />
      </Box>
    </Card>
  );
};

export default Welcome;
