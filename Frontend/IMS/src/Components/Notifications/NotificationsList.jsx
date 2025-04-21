import React, { useState, useEffect } from "react";
import { useDataProvider, useNotify, useRefresh } from "react-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button as MuiButton,
  CircularProgress,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { format } from "date-fns";
import axios from "axios";
import NotificationDescription from "./NotificationDescription";

const NotificationsTable = ({ notifications }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [loadingStates, setLoadingStates] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMarkAsRead = async (id) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      await dataProvider.update("updateNotification", {
        id: id,
        data: { status: "Read" },
        previousData: notifications.find((n) => n.id === id),
      });
      notify("Notification marked as read", { type: "success" });
      location.reload();
      refresh();
    } catch (error) {
      notify(`Error: ${error.message}`, { type: "error" });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteClick = (id) => {
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!notificationToDelete) return;

    setLoadingStates((prev) => ({
      ...prev,
      [`delete-${notificationToDelete}`]: true,
    }));
    try {
      await dataProvider.delete("deleteNotification", {
        id: notificationToDelete,
      });
      notify("Notification deleted", { type: "success" });
      location.reload();
      setDeleteDialogOpen(false);
      refresh();
    } catch (error) {
      notify(`Error: ${error.message}`, { type: "error" });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [`delete-${notificationToDelete}`]: false,
      }));
      setNotificationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNotificationToDelete(null);
  };

  const handleShowDescription = (notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseDescription = () => {
    setSelectedNotification(null);
  };

  const truncateDescription = (description) => {
    if (description.length > 50) {
      return `${description.substring(0, 50)}...`;
    }
    return description;
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="notifications table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>{notification.title}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    {truncateDescription(notification.description)}
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        color:
                          notification.status === "Not Read"
                            ? "#d32f2f"
                            : "#2e7d32",
                        fontWeight: "bold",
                      }}
                    >
                      {notification.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(notification.date), "MMM dd, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <MuiButton
                      variant="outlined"
                      size="small"
                      onClick={() => handleShowDescription(notification)}
                    >
                      Read More
                    </MuiButton>
                  </TableCell>
                  <TableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      {notification.status === "Not Read" && (
                        <MuiButton
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={
                            loadingStates[notification.id] ? (
                              <CircularProgress size={14} />
                            ) : (
                              <CheckCircleOutlineIcon />
                            )
                          }
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={loadingStates[notification.id]}
                        >
                          Mark as Read
                        </MuiButton>
                      )}
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteClick(notification.id)}
                        disabled={loadingStates[`delete-${notification.id}`]}
                      >
                        {loadingStates[`delete-${notification.id}`] ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteIcon color="error" />
                        )}
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Notification?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this notification? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            autoFocus
            disabled={loadingStates[`delete-${notificationToDelete}`]}
          >
            {loadingStates[`delete-${notificationToDelete}`] ? (
              <CircularProgress size={20} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Description Dialog */}
      {selectedNotification && (
        <NotificationDescription
          open={Boolean(selectedNotification)}
          onClose={handleCloseDescription}
          title={selectedNotification.title}
          description={selectedNotification.description}
          date={selectedNotification.date}
          status={selectedNotification.status}
        />
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={notifications.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          backgroundColor: "#f5f5f5",
          borderBottomLeftRadius: "4px",
          borderBottomRightRadius: "4px",
        }}
      />
    </>
  );
};

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch notifications");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [serverHost]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!notifications.length)
    return (
      <div className="flex items-center h-screen justify-center">
        No notifications found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>
        <NotificationsTable notifications={notifications} />
      </div>
    </div>
  );
};

export default NotificationsList;
