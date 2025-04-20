import React from "react";
import {
  format,
  subYears,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from "date-fns";

const YearlyReport = ({
  purchasedProducts,
  soldProducts,
  otherIncome,
  otherExpenses,
}) => {
  const now = new Date();
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);

  const filterByYear = (items, dateField) => {
    return items.filter((item) => {
      if (!item[dateField]) return false;
      const itemDate = new Date(item[dateField]);
      return isWithinInterval(itemDate, { start: yearStart, end: yearEnd });
    });
  };

  const yearPurchases = filterByYear(purchasedProducts, "purchase_date");
  const yearSales = filterByYear(soldProducts, "salesDate");
  const yearIncome = filterByYear(otherIncome, "createdAt");
  const yearExpenses = filterByYear(otherExpenses, "createdAt");

  const calculateTotals = (items, amountField) => {
    return items.reduce(
      (sum, item) => sum + (parseFloat(item[amountField]) || 0),
      0
    );
  };

  const salesTotal = calculateTotals(yearSales, "total_price");
  const salesCost = calculateTotals(yearSales, "productCost");
  const salesProfit = salesTotal - salesCost;
  const purchasesTotal = calculateTotals(yearPurchases, "overall_cost");
  const incomeTotal = calculateTotals(yearIncome, "amount");
  const expensesTotal = calculateTotals(yearExpenses, "amount");

  const overallIncome = salesTotal + incomeTotal;
  const overallExpense = purchasesTotal + expensesTotal;
  const netProfit = overallIncome - overallExpense;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Yearly Report ({format(yearStart, "yyyy")})
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <h3 className="font-medium text-gray-700">Total Sales</h3>
          <p className="text-2xl font-bold">{salesTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <h3 className="font-medium text-gray-700">Total Income</h3>
          <p className="text-2xl font-bold">{overallIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
          <h3 className="font-medium text-gray-700">Total Expenses</h3>
          <p className="text-2xl font-bold">{overallExpense.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
          <h3 className="font-medium text-gray-700">Net Profit</h3>
          <p
            className={`text-2xl font-bold ${
              netProfit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {netProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Table */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Sales</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
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
                {yearSales.map((sale, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.productName || "N/A"}
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
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase">
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
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Purchases</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yearPurchases.map((purchase, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.productName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.overall_cost}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase">
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

        {/* Income Table */}
        <div className="bg-white p-4 rounded shadow">
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
                {yearIncome.map((income, i) => (
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

        {/* Expenses Table */}
        <div className="bg-white p-4 rounded shadow">
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
                {yearExpenses.map((expense, i) => (
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
      </div>
    </div>
  );
};

export default YearlyReport;
