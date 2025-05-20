import React, { useState, useEffect } from "react";
import { useDataProvider } from "react-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  format,
  subDays,
  subMonths,
  subYears,
  isWithinInterval,
  eachDayOfInterval,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AnalysisPage = () => {
  const dataProvider = useDataProvider();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [activeTab, setActiveTab] = useState("revenue");
  const [timePeriod, setTimePeriod] = useState("today");
  const [filteredData, setFilteredData] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const { data } = await dataProvider.getList("FinancialAnalaysis", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "DESC" },
        });
        setSalesData(data);

        // Prepare daily sales data for the last 30 days
        const thirtyDaysAgo = subDays(new Date(), 30);
        const dailySales = eachDayOfInterval({
          start: thirtyDaysAgo,
          end: new Date(),
        }).map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const daySales = data.filter(
            (item) =>
              item.salesDate &&
              format(new Date(item.salesDate), "yyyy-MM-dd") === dateStr
          );
          const total = daySales.reduce(
            (sum, item) => sum + (item.total_price || 0),
            0
          );
          return {
            date: dateStr,
            total: parseFloat(total.toFixed(2)),
          };
        });

        setDailySalesData(dailySales);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch sales data");
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    if (!salesData.length) return;

    let filtered = [];
    const now = new Date();

    switch (timePeriod) {
      case "today":
        filtered = salesData.filter(
          (item) =>
            item.salesDate &&
            new Date(item.salesDate).toDateString() === now.toDateString()
        );
        break;
      case "week":
        const weekAgo = subDays(now, 7);
        filtered = salesData.filter(
          (item) =>
            item.salesDate &&
            isWithinInterval(new Date(item.salesDate), {
              start: weekAgo,
              end: now,
            })
        );
        break;
      case "month":
        const monthAgo = subMonths(now, 1);
        filtered = salesData.filter(
          (item) =>
            item.salesDate &&
            isWithinInterval(new Date(item.salesDate), {
              start: monthAgo,
              end: now,
            })
        );
        break;
      case "year":
        const yearAgo = subYears(now, 1);
        filtered = salesData.filter(
          (item) =>
            item.salesDate &&
            isWithinInterval(new Date(item.salesDate), {
              start: yearAgo,
              end: now,
            })
        );
        break;
      default:
        filtered = salesData;
    }

    // Group by product
    const productMap = new Map();
    filtered.forEach((item) => {
      const productName = item.productName || "Unknown Product";
      if (productMap.has(productName)) {
        productMap.set(productName, {
          ...productMap.get(productName),
          quantity: productMap.get(productName).quantity + item.quantity,
          totalPrice:
            productMap.get(productName).totalPrice + (item.total_price || 0),
        });
      } else {
        productMap.set(productName, {
          productName,
          quantity: item.quantity,
          totalPrice: item.total_price || 0,
        });
      }
    });

    // Convert to array and sort based on active tab
    const processedData = Array.from(productMap.values());

    if (activeTab === "revenue") {
      processedData.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (activeTab === "quantity") {
      processedData.sort((a, b) => b.quantity - a.quantity);
    }

    setFilteredData(processedData);
  }, [activeTab, timePeriod, salesData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTimePeriodChange = (event, newValue) => {
    setTimePeriod(newValue);
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
    <Box sx={{ width: "100%", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Sales Analysis
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="sales analysis tabs"
        >
          <Tab label="By Revenue" value="revenue" />
          <Tab label="By Quantity" value="quantity" />
          <Tab label="Daily Sales (30 days)" value="daily" />
        </Tabs>
      </Box>

      {activeTab !== "daily" ? (
        <>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={timePeriod}
              onChange={handleTimePeriodChange}
              aria-label="time period tabs"
            >
              <Tab label="Today" value="today" />
              <Tab label="Last Week" value="week" />
              <Tab label="Last Month" value="month" />
              <Tab label="Last Year" value="year" />
            </Tabs>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="sales analysis table">
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Product Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    {activeTab === "revenue"
                      ? "Total Revenue (ETB)"
                      : "Quantity Sold"}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                    {activeTab === "revenue"
                      ? "Quantity Sold"
                      : "Total Revenue (ETB)"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell align="right">
                        {activeTab === "revenue"
                          ? `${product.totalPrice.toFixed(2)}`
                          : product.quantity}
                      </TableCell>
                      <TableCell align="right">
                        {activeTab === "revenue"
                          ? product.quantity
                          : `${product.totalPrice.toFixed(2)}`}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No sales data available for this period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Box sx={{ height: 500, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Daily Sales for Last 30 Days
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={dailySalesData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM dd")}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} ETB`, "Total Sales"]}
                labelFormatter={(date) =>
                  format(new Date(date), "MMMM do, yyyy")
                }
              />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default AnalysisPage;
