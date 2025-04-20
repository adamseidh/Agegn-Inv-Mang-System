import React, { useEffect, useState } from "react";
import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationButton = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        const token = JSON.parse(storedToken).token;

        const response = await axios.get(`${serverHost}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Count only notifications with status "Not Read"
        const notReadCount = response.data.filter(
          (notification) => notification.status === "Not Read"
        ).length;

        setUnreadCount(notReadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    //Set up polling to check for new notifications periodically
    const interval = setInterval(fetchNotifications, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [serverHost]);

  const handleClick = () => {
    navigate("/notifications");
  };

  return (
    <IconButton color="inherit" onClick={handleClick}>
      <Badge
        badgeContent={unreadCount}
        color="error"
        max={99}
        invisible={unreadCount === 0} // Hide badge when count is 0
      >
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationButton;
