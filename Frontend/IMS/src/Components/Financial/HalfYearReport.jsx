import React from "react";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { FormattedNumber } from "../../helpers/functions/FormattedNumber";

const HalfYearReport = ({
  purchasedProducts,
  soldProducts,
  otherIncome,
  otherExpenses,
}) => {
  const now = new Date();
  const halfYearStart = startOfMonth(subMonths(now, 5));
  const halfYearEnd = endOfMonth(now);

  console.log("current data", purchasedProducts);

  const filterByHalfYear = (items, dateField) => {
    return items.filter((item) => {
      if (!item[dateField]) return false;
      const itemDate = new Date(item[dateField]);
      return isWithinInterval(itemDate, {
        start: halfYearStart,
        end: halfYearEnd,
      });
    });
  };

  const halfYearPurchases = filterByHalfYear(
    purchasedProducts,
    "purchase_date"
  );
  const halfYearSales = filterByHalfYear(soldProducts, "salesDate");
  const halfYearIncome = filterByHalfYear(otherIncome, "createdAt");
  const halfYearExpenses = filterByHalfYear(otherExpenses, "createdAt");

  const calculateTotals = (items, amountField) => {
    return items.reduce(
      (sum, item) => sum + (parseFloat(item[amountField]) || 0),
      0
    );
  };

  const salesTotal = calculateTotals(halfYearSales, "total_price");
  const salesCost = calculateTotals(halfYearSales, "productCost");
  const salesProfit = salesTotal - salesCost;
  const purchasesTotal = calculateTotals(
    halfYearPurchases,
    "productCostAmount"
  );
  const incomeTotal = calculateTotals(halfYearIncome, "amount");
  const expensesTotal = calculateTotals(halfYearExpenses, "amount");

  const overallIncome = salesTotal + incomeTotal;
  const overallExpense = purchasesTotal + expensesTotal;
  const netCashFlow = overallIncome - overallExpense;
  const netProfit = incomeTotal - expensesTotal + salesProfit;
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Half Year Report ({format(halfYearStart, "MMM yyyy")} -{" "}
        {format(halfYearEnd, "MMM yyyy")})
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <h3 className="font-medium text-gray-700">Total Income</h3>
          <p className="text-2xl font-bold">{FormattedNumber(overallIncome)}</p>
          <p className="text-sm text-gray-500">
            Sales: {FormattedNumber(salesTotal)}
          </p>
          <p className="text-sm text-gray-500">
            Other: {FormattedNumber(incomeTotal)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
          <h3 className="font-medium text-gray-700">Total Expenses</h3>
          <p className="text-2xl font-bold">
            {FormattedNumber(overallExpense)}
          </p>
          <p className="text-sm text-gray-500">
            Purchases: {FormattedNumber(purchasesTotal)}
          </p>
          <p className="text-sm text-gray-500">
            Other: {FormattedNumber(expensesTotal)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
          <h3 className="font-medium text-gray-700">Net Cash flow</h3>
          <p
            className={`text-2xl font-bold ${
              netCashFlow >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {FormattedNumber(netCashFlow)}
          </p>
          <p className="text-sm text-gray-500">
            From Product: {FormattedNumber(salesTotal - purchasesTotal)}
          </p>
          <p className="text-sm text-gray-500">
            From Other: {FormattedNumber(incomeTotal - expensesTotal)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <h3 className="font-medium text-gray-700">Net Profit</h3>
          <p
            className={`text-2xl font-bold ${
              netProfit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {FormattedNumber(netProfit)}
          </p>
          <p className="text-sm text-gray-500">
            From Sales: {FormattedNumber(salesProfit)}
          </p>
          <p className="text-sm text-gray-500">
            From Other: {FormattedNumber(incomeTotal - expensesTotal)}
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
                {halfYearSales.map((sale, i) => (
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
                    {FormattedNumber(salesTotal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {FormattedNumber(salesProfit)}
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
                {halfYearPurchases.map((purchase, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.productName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.productCostAmount}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {FormattedNumber(purchasesTotal)}
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
                {halfYearIncome.map((income, i) => (
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
                    {FormattedNumber(incomeTotal)}
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
                {halfYearExpenses.map((expense, i) => (
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
                    {FormattedNumber(expensesTotal)}
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

export default HalfYearReport;
