import React, { useState, useEffect } from "react";
import { useDataProvider } from "react-admin";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";

const ActivityHistory = () => {
  const dataProvider = useDataProvider();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userName, setUserName] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await dataProvider.getList(`fetchUsersHistory/${id}`, {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "created_at", order: "DESC" },
        });
        setActivities(data);
        const name = data.length > 0 ? data[0].UserName : "";
        setUserName(name);
        setFilteredActivities(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch activities");
        setLoading(false);
      }
    };

    fetchActivities();
  }, [id]);

  useEffect(() => {
    let result = activities;

    // Apply search filter
    if (searchTerm) {
      result = result.filter((activity) =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date range filter
    if (fromDate) {
      const fromDateObj = startOfDay(new Date(fromDate));
      result = result.filter(
        (activity) => new Date(activity.created_at) >= fromDateObj
      );
    }

    if (toDate) {
      const toDateObj = endOfDay(new Date(toDate));
      result = result.filter(
        (activity) => new Date(activity.created_at) <= toDateObj
      );
    }

    setFilteredActivities(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, fromDate, toDate, activities]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {userName}, Activity History
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Search by Title"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />

        <TextField
          label="From Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        <TextField
          label="To Date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          sx={{ minWidth: 200 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="activity history table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Roll No.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Activity Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActivities.length > 0 ? (
              filteredActivities
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((activity, index) => (
                  <TableRow key={activity.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{activity.title}</TableCell>
                    <TableCell>
                      {format(
                        parseISO(activity.created_at),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No activities found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredActivities.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default ActivityHistory;
