import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format, subDays, addDays, isSameDay } from "date-fns";

const IncomeExpenseChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const storedToken = JSON.parse(localStorage.getItem("token"));
        const token = storedToken?.token;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          soldResponse,
          purchasedResponse,
          incomeResponse,
          expensesResponse,
        ] = await Promise.all([
          axios.get(`${serverHost}/soldProducts`, config),
          axios.get(`${serverHost}/purchasedProducts`, config),
          axios.get(`${serverHost}/otherIncome`, config),
          axios.get(`${serverHost}/otherExpenses`, config),
        ]);

        // Process the data to create daily totals
        processChartData(
          soldResponse.data,
          purchasedResponse.data,
          incomeResponse.data,
          expensesResponse.data
        );
      } catch (err) {
        setError(err.message || "Failed to fetch financial data");
        setLoading(false);
      }
    };

    fetchData();
  }, [serverHost]);

  const processChartData = (
    soldProducts,
    purchasedProducts,
    otherIncome,
    otherExpenses
  ) => {
    // Get the last 30 days
    const lastDay = new Date();
    const dateRange = Array.from({ length: 30 }, (_, i) =>
      subDays(lastDay, i)
    ).reverse();

    // Filter completed purchases only
    const completedPurchases = purchasedProducts.filter(
      (item) => item.payment_status === "Completed"
    );

    // Create daily totals
    const chartData = dateRange.map((date) => {
      // Filter sales for this day
      const dailySales = soldProducts.filter(
        (item) => item.salesDate && isSameDay(new Date(item.salesDate), date)
      );
      const salesTotal = dailySales.reduce(
        (sum, item) => sum + (parseFloat(item.total_price) || 0),
        0
      );

      // Filter income for this day
      const dailyIncome = otherIncome.filter(
        (item) => item.createdAt && isSameDay(new Date(item.createdAt), date)
      );
      const incomeTotal = dailyIncome.reduce(
        (sum, item) => sum + (parseFloat(item.amount) || 0),
        0
      );

      // Filter purchases for this day (only completed)
      const dailyPurchases = completedPurchases.filter(
        (item) =>
          item.purchase_date && isSameDay(new Date(item.purchase_date), date)
      );
      const purchasesTotal = dailyPurchases.reduce(
        (sum, item) => sum + (parseFloat(item.overall_cost) || 0),
        0
      );

      // Filter expenses for this day
      const dailyExpenses = otherExpenses.filter(
        (item) => item.createdAt && isSameDay(new Date(item.createdAt), date)
      );
      const expensesTotal = dailyExpenses.reduce(
        (sum, item) => sum + (parseFloat(item.amount) || 0),
        0
      );

      return {
        date: date.getTime(),
        income: salesTotal + incomeTotal,
        expense: purchasesTotal + expensesTotal,
      };
    });

    setData(chartData);
    setLoading(false);
  };

  const dateFormatter = (date) => format(new Date(date), "MMM dd");

  if (loading) {
    return (
      <Card>
        <CardHeader title="Monthly Income and Expenses" />
        <CardContent
          style={{
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>Loading data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Monthly Income and Expenses" />
        <CardContent
          style={{
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ color: "red" }}>{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Monthly Income and Expenses" />
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f44336" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f44336" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                name="Date"
                type="number"
                scale="time"
                domain={[
                  subDays(new Date(), 29).getTime(),
                  new Date().getTime(),
                ]}
                tickFormatter={dateFormatter}
              />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "ETB",
                  }).format(value)
                }
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value) =>
                  new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "ETB",
                    minimumFractionDigits: 2,
                  }).format(value)
                }
                labelFormatter={(label) =>
                  format(new Date(label), "MMMM dd, yyyy")
                }
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#4caf50"
                strokeWidth={2}
                fill="url(#colorIncome)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#f44336"
                strokeWidth={2}
                fill="url(#colorExpense)"
                name="Expense"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseChart;
