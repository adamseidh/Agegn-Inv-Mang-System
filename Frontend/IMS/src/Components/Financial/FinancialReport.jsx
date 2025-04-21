import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import WeeklyReport from "./WeeklyReport";
import MonthlyReport from "./MonthlyReport";
import QuarterlyReport from "./QuarterlyReport";
import HalfYearReport from "./HalfYearReport";
import YearlyReport from "./YearlyReport";

const FinancialReport = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    purchasedProducts: [],
    soldProducts: [],
    otherIncome: [],
    otherExpenses: [],
  });
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get the token from localStorage
        const storedToken = JSON.parse(localStorage.getItem("token"));
        const token = storedToken?.token;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          purchasedResponse,
          soldResponse,
          incomeResponse,
          expensesResponse,
        ] = await Promise.all([
          axios.get(`${serverHost}/purchasedProducts`, config),
          axios.get(`${serverHost}/soldProducts`, config),
          axios.get(`${serverHost}/otherIncomes`, config),
          axios.get(`${serverHost}/otherExpenses`, config),
        ]);

        setData({
          purchasedProducts: purchasedResponse.data,
          soldProducts: soldResponse.data,
          otherIncome: incomeResponse.data,
          otherExpenses: expensesResponse.data,
        });

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch financial data");
        setLoading(false);
      }
    };

    fetchData();
  }, [serverHost]);

  console.log("sold products,", data.soldProducts);
  console.log("sold otherIncome,", data.otherIncome);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Financial Report</h1>

      <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
        <TabList className="flex flex-wrap border-b border-gray-200">
          <Tab className="px-4 py-2 font-medium text-sm rounded-t-lg mr-1 mb-1 focus:outline-none">
            Weekly
          </Tab>
          <Tab className="px-4 py-2 font-medium text-sm rounded-t-lg mr-1 mb-1 focus:outline-none">
            Monthly
          </Tab>
          <Tab className="px-4 py-2 font-medium text-sm rounded-t-lg mr-1 mb-1 focus:outline-none">
            Quarterly
          </Tab>
          <Tab className="px-4 py-2 font-medium text-sm rounded-t-lg mr-1 mb-1 focus:outline-none">
            Half Year
          </Tab>
          <Tab className="px-4 py-2 font-medium text-sm rounded-t-lg mr-1 mb-1 focus:outline-none">
            Yearly
          </Tab>
        </TabList>

        <TabPanel>
          <WeeklyReport
            purchasedProducts={data.purchasedProducts}
            soldProducts={data.soldProducts}
            otherIncome={data.otherIncome}
            otherExpenses={data.otherExpenses}
          />
        </TabPanel>
        <TabPanel>
          <MonthlyReport
            purchasedProducts={data.purchasedProducts}
            soldProducts={data.soldProducts}
            otherIncome={data.otherIncome}
            otherExpenses={data.otherExpenses}
          />
        </TabPanel>
        <TabPanel>
          <QuarterlyReport
            purchasedProducts={data.purchasedProducts}
            soldProducts={data.soldProducts}
            otherIncome={data.otherIncome}
            otherExpenses={data.otherExpenses}
          />
        </TabPanel>
        <TabPanel>
          <HalfYearReport
            purchasedProducts={data.purchasedProducts}
            soldProducts={data.soldProducts}
            otherIncome={data.otherIncome}
            otherExpenses={data.otherExpenses}
          />
        </TabPanel>
        <TabPanel>
          <YearlyReport
            purchasedProducts={data.purchasedProducts}
            soldProducts={data.soldProducts}
            otherIncome={data.otherIncome}
            otherExpenses={data.otherExpenses}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default FinancialReport;
