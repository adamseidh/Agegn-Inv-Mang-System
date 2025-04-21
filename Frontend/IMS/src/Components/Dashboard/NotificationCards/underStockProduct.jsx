import React, { useState, useEffect } from "react";
import DollarIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group"; // Icon for Traders
import { useDataProvider } from "react-admin";
import SpeedIcon from "@mui/icons-material/Speed";
import ViewListIcon from "@mui/icons-material/ViewList";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import CardWithIcon from "../CardWithIcon";

export const UnderStrockProduct = (props) => {
  const [expiredProducts, setExpiredProducts] = useState(0);
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await dataProvider.getList("understockProductsCount", {
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
      icon={SpeedIcon}
      title="Under Stock Products"
      subtitle={expiredProducts}
      link={"understockProducts"}
      passedColor={"red"}
    />
  );
};
