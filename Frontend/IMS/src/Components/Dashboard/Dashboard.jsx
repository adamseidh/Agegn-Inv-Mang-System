import React from "react";
import Welcome from "./Welcom";
import { ExpiredProducts, TotalCustomersCard, TotalProductsCard, TotalSuppliersCard } from "./Cards";
import IncomeExpenseChart from "./IncomeExpenseChart";

const Dashboard = () => (
    <div style={{ textAlign: "center", padding: "0px" }}>
        <Welcome />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-1 mb-4">

            <TotalProductsCard />
            <TotalSuppliersCard />
            <TotalCustomersCard />
            <ExpiredProducts />
        </div>
        <IncomeExpenseChart />

    </div>
);

export default Dashboard;
