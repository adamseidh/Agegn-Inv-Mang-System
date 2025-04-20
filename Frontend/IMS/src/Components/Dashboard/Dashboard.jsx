import React, { useEffect, useState } from "react";
import Welcome from "./Welcom";
import {
  ExpiredProducts,
  TotalCustomersCard,
  TotalProductsCard,
  TotalSuppliersCard,
} from "./Cards";
import axios from "axios";
import IncomeExpenseChart from "./IncomeExpenseChart";
import { usePermissions } from "react-admin";
import Permission from "../../helpers/utils/permissions";

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUserId && storedRole && storedToken) {
      const parsedUserId = JSON.parse(storedUserId).userId;
      const parsedRole = JSON.parse(storedRole).role;
      const token = JSON.parse(storedToken).token;

      setUserId(parsedUserId);
      setRole(parsedRole);

      console.log("User Role:", parsedRole);

      // Fetch user details only if userId is available
      axios
        .get(`${serverHost}/users/${parsedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          setUser(resp.data);
          console.log("User Data:", resp.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  // Get permission levels
  const { permission1, permission2, permission3 } = Permission(role);

  return (
    <div style={{ textAlign: "center", padding: "0px" }}>
      {/* Welcome is not protected - always shown */}
      <Welcome />

      {/* Cards grid - only shown for permission1 */}
      {permission1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-1 mb-4">
          <TotalProductsCard />
          <TotalSuppliersCard />
          <TotalCustomersCard />
          <ExpiredProducts />
        </div>
      )}

      {/* Chart - only shown for permission1 */}
      {permission1 && <IncomeExpenseChart />}
    </div>
  );
};

export default Dashboard;
