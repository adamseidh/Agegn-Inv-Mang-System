// MyAppBar.jsx
import { AppBar, TitlePortal } from "react-admin";
import { Box } from "@mui/material";
import NotificationButton from "./NotificationButton";

const MyAppBar = () => (
  <AppBar>
    <TitlePortal />
    <Box sx={{ flex: 1 }} /> {/* Push next items to the right */}
    <NotificationButton />
  </AppBar>
);

export default MyAppBar;
