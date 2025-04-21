import React, { useState, useEffect } from "react";
import DollarIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group"; // Icon for Traders
import { useDataProvider } from "react-admin";
import TodayIcon from "@mui/icons-material/Today";
import ViewListIcon from "@mui/icons-material/ViewList";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import CardWithIcon from "../CardWithIcon";

export const ReachedDuePayments = (props) => {
  const [expiredProducts, setExpiredProducts] = useState(0);
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await dataProvider.getList("reachedDuePayments", {
          sort: { field: "id", order: "ASC" },
          filter: {},
        });

        const totalData = data.length || "None";
        console.log("expired dat", data);
        setExpiredProducts(totalData);
      } catch (error) {
        console.error("Error fetching  data:", error);
      }
    };

    fetchData();
  }, [dataProvider]);

  return (
    <CardWithIcon
      icon={TodayIcon}
      title="Reached Due Payments"
      subtitle={expiredProducts}
      link={"reachedDuePayments"}
      passedColor={"red"}
    />
  );
};
