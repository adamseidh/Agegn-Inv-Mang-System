import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const WeeklyReport = ({
  purchasedProducts,
  soldProducts,
  otherIncome,
  otherExpenses,
}) => {
  const [activeDay, setActiveDay] = useState(0);
  const now = new Date();
  const weekStart = startOfWeek(now);
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const filterByDay = (items, dateField) => {
    return items.filter((item) => {
      if (!item[dateField]) return false;
      const itemDate = new Date(item[dateField]);
      return isSameDay(itemDate, days[activeDay]);
    });
  };

  const dayPurchases = filterByDay(purchasedProducts, "purchase_date");
  const daySales = filterByDay(soldProducts, "salesDate");
  const dayIncome = filterByDay(otherIncome, "createdAt");
  const dayExpenses = filterByDay(otherExpenses, "createdAt");

  const calculateTotals = (items, amountField) => {
    return items.reduce(
      (sum, item) => sum + (parseFloat(item[amountField]) || 0),
      0
    );
  };

  const salesTotal = calculateTotals(daySales, "total_price");
  const salesCost = calculateTotals(daySales, "productCost");
  const salesProfit = salesTotal - salesCost;
  const purchasesTotal = calculateTotals(dayPurchases, "overall_cost");
  const incomeTotal = calculateTotals(dayIncome, "amount");
  const expensesTotal = calculateTotals(dayExpenses, "amount");

  const overallIncome = salesTotal + incomeTotal;
  const overallExpense = purchasesTotal + expensesTotal;
  const netProfit = overallIncome - overallExpense;

  return (
    <div className="mt-6">
      <Tabs selectedIndex={activeDay} onSelect={(index) => setActiveDay(index)}>
        <TabList className="flex flex-wrap border-b border-gray-200">
          {days.map((day, index) => (
            <Tab
              key={index}
              className="px-4 py-2 font-medium text-sm rounded-t-lg mr-1 mb-1 focus:outline-none"
            >
              {format(day, "EEEE")}
            </Tab>
          ))}
        </TabList>

        {days.map((day, index) => (
          <TabPanel key={index}>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">
                {format(day, "EEEE, MMMM do yyyy")}
              </h2>

              {/* Sales Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Sales</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {daySales.map((sale, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {sale.productName || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {sale.unit_price?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {sale.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {sale.total_price?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(
                              (sale.total_price || 0) - (sale.productCost || 0)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase"
                        >
                          Total
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {salesTotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {salesProfit.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Purchases Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Purchases</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dayPurchases.map((purchase, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.productName || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.purchase_price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {purchase.overall_cost}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase"
                        >
                          Total
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {purchasesTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Other Income Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Other Income</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dayIncome.map((income, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {income.source}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {income.amount}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase">
                          Total
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {incomeTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Other Expenses Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Other Expenses</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dayExpenses.map((expense, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {expense.reason}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {expense.amount}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase">
                          Total
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {expensesTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Daily Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-medium text-gray-700">Income</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {overallIncome.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sales: {salesTotal.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Other: {incomeTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-medium text-gray-700">Expenses</h4>
                    <p className="text-2xl font-bold text-red-600">
                      {overallExpense.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Purchases: {purchasesTotal.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Other: {expensesTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-medium text-gray-700">Net Profit</h4>
                    <p
                      className={`text-2xl font-bold ${
                        netProfit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {netProfit.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      From Sales: {salesProfit.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      From Other: {(incomeTotal - expensesTotal).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default WeeklyReport;
