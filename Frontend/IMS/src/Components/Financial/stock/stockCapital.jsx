import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormattedNumber } from "../../../helpers/functions/FormattedNumber";

const StockCapital = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  useEffect(() => {
    const fetchStockData = async () => {
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

        const response = await axios.get(`${serverHost}/StockCapital`, config);
        setStockData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch stock capital data");
        setLoading(false);
      }
    };

    fetchStockData();
  }, [serverHost]);

  // Calculate metrics from the data
  const calculateMetrics = () => {
    if (!stockData.length) return null;

    let purchaseCapital = 0;
    let costCapital = 0;
    let sellingCapital = 0;
    let totalQuantity = 0;

    // Use a Set to track unique product IDs
    const uniqueProductIds = new Set();

    stockData.forEach((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const purchasePrice = parseFloat(item.purchase_price) || 0;
      const overallCost = parseFloat(item.overall_cost) || 0;
      const sellingPrice = parseFloat(item.selling_price) || 0;

      purchaseCapital += quantity * purchasePrice;
      costCapital += quantity * overallCost;
      sellingCapital += quantity * sellingPrice;
      totalQuantity += quantity;

      if (item.item_id) {
        uniqueProductIds.add(item.item_id);
      }
    });

    const uniqueProductsCount = uniqueProductIds.size;

    return {
      purchaseCapital: purchaseCapital.toFixed(2),
      costCapital: costCapital.toFixed(2),
      sellingCapital: sellingCapital.toFixed(2),
      totalQuantity,
      uniqueProductsCount,
    };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (!stockData.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-500">
          No stock data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Stock Capital Overview
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-600">
                Product Items
              </h3>
              <p className="text-3xl font-bold text-blue-800">
                {metrics.uniqueProductsCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-600">
                Total Quantity
              </h3>
              <p className="text-3xl font-bold text-green-800">
                {metrics.totalQuantity.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Capital Metrics Table */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Capital Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Purchase Capital Card */}
          <div className="bg-white p-5 rounded-lg border border-purple-200 shadow-sm transition-transform duration-300 hover:transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-purple-600 mb-1">
                Purchase Capital
              </h4>
              <p className="text-2xl font-bold text-purple-800">
                {FormattedNumber(metrics.purchaseCapital)} ETB
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Based on quantity x purchase price
              </p>
            </div>
          </div>

          {/* Cost Capital Card */}
          <div className="bg-white p-5 rounded-lg border border-amber-200 shadow-sm transition-transform duration-300 hover:transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-amber-600 mb-1">
                Overall Cost Capital
              </h4>
              <p className="text-2xl font-bold text-amber-800">
                {FormattedNumber(metrics.costCapital)} ETB
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Based on quantity x overall cost
              </p>
            </div>
          </div>

          {/* Selling Capital Card */}
          <div className="bg-white p-5 rounded-lg border border-teal-200 shadow-sm transition-transform duration-300 hover:transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="bg-teal-100 p-3 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-teal-600 mb-1">
                Selling Capital
              </h4>
              <p className="text-2xl font-bold text-teal-800">
                {FormattedNumber(metrics.sellingCapital)} ETB
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Based on quantity x selling price
              </p>
            </div>
          </div>
        </div>

        {/* Summary Row */}
        <div className="mt-6 bg-gradient-to-r from-primaryColor to-blue-600 rounded-lg p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Total Inventory Value</h4>
              <p className="text-sm opacity-90">Combined value of all stock</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {FormattedNumber(metrics.costCapital)} ETB
              </p>
              <p className="text-sm opacity-90">Based on overall cost</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCapital;
