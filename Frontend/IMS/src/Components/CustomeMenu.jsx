import React, { useEffect, useState } from "react";
import { Menu, MenuItemLink, useDataProvider } from "react-admin";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ArticleIcon from "@mui/icons-material/Article";
import ChatIcon from "@mui/icons-material/Chat";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import GroupIcon from "@mui/icons-material/Group"; // Icon for Traders
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AddCardIcon from "@mui/icons-material/AddCard";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import ViewListIcon from "@mui/icons-material/ViewList";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Inventory2TwoToneIcon from "@mui/icons-material/Inventory2TwoTone";
import ShoppingCartSharpIcon from "@mui/icons-material/ShoppingCartSharp";
import Shop2Icon from "@mui/icons-material/Shop2";
import TypeSpecimenOutlinedIcon from "@mui/icons-material/TypeSpecimenOutlined";
import InsightsIcon from "@mui/icons-material/Insights";
import PaymentsIcon from "@mui/icons-material/Payments";

import axios from "axios";
import Permission from "../helpers/utils/permissions";
import { Badge } from "@mui/material";

const CustomMenu = (props) => {
  const [openFinancial, setOpenFinancial] = useState(true);
  const [openPlanBudget, setOpenPlanBudget] = useState(false);
  const [openCashflow, setOpenCashflow] = useState(false);
  const [user, setUser] = useState([]);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
  const [unreadMessages, setUnreadMessage] = useState("");
  const [processingOrders, setProcessingOrders] = useState("");

  const dataProvider = useDataProvider();

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

  ///bagdes data fetch

  useEffect(() => {
    const fetechUnseenMessage = async () => {
      try {
        const { data } = await dataProvider.getList("messages", {
          sort: { field: "id", order: "ASC" },
          filter: {},
        });

        // Filter unseen messages
        const unseenMessages = data.filter(
          (item) => item.message_status === "UnSeen"
        );

        const totalUnreadMessage = unseenMessages.length;
        console.log(
          "unread un seeen messagesssklsdsfkdsdkj ",
          totalUnreadMessage
        );
        setUnreadMessage(totalUnreadMessage);
      } catch (error) {
        console.error("Error fetching unseen messages:", error);
      }
    };

    fetechUnseenMessage();
  }, [dataProvider]);

  ///fetch badge data for ordrs
  useEffect(() => {
    const fetchProcessingOrder = async () => {
      try {
        const { data } = await dataProvider.getList("orders", {
          sort: { field: "id", order: "ASC" },
          filter: {},
        });

        // Filter unseen messages
        const processingOrders = data.filter(
          (item) => item.sells_status === "Processing"
        );

        const totalprocessingOrders = processingOrders.length;
        console.log(
          "unread un seeen messagesssklsdsfkdsdkj ",
          totalprocessingOrders
        );
        setProcessingOrders(totalprocessingOrders);
      } catch (error) {
        console.error("Error fetching unseen messages:", error);
      }
    };

    fetchProcessingOrder();
  }, [dataProvider]);

  console.log("here is the user name", user);
  //inventory
  const [openInventory, setOpenInventory] = useState(true);

  // Toggle Inventory Menu
  const handleInventoryToggle = (event) => {
    event.preventDefault(); // Prevent navigation to `undefined`
    setOpenInventory(!openInventory);
  };

  // Toggle Financial Menu
  const handleFinancialToggle = (event) => {
    event.preventDefault(); // Prevent navigation to `undefined`
    setOpenFinancial(!openFinancial);
  };

  // Toggle Plan & Budget Submenu
  const handlePlanBudgetToggle = (event) => {
    event.preventDefault();
    setOpenPlanBudget(!openPlanBudget);
  };

  // Toggle Cashflow Submenu
  const handleCashflowToggle = (event) => {
    event.preventDefault();
    setOpenCashflow(!openCashflow);
  };

  const { permission1, permission2, permission3 } = Permission(role);

  return (
    <Menu
      {...props}
      className="bg-gray-200 rounded-t min-h-screen rounded-xl m-6 border-2 "
    >
      {/* Static Menu Items */}
      <MenuItemLink
        to="/"
        primaryText="Dashboard"
        leftIcon={<DashboardIcon />}
      />
      {/**Collapsible Inventory */}

      <MenuItemLink
        to="#"
        primaryText={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Inventory
            {openInventory ? <ExpandLess /> : <ExpandMore />}
          </div>
        }
        leftIcon={<InventoryIcon />}
        onClick={handleInventoryToggle}
        righticon={openInventory ? <ExpandLess /> : <ExpandMore />}
      />
      {openInventory && (
        <>
          <MenuItemLink
            to="/category"
            primaryText="Product Category"
            leftIcon={<CategoryIcon />} // Left Icon for Income
            style={{ paddingLeft: 48 }}
          />
          <MenuItemLink
            to="/productType"
            primaryText="Product Type"
            leftIcon={<TypeSpecimenOutlinedIcon />} // Left Icon for Income
            style={{ paddingLeft: 48 }}
          />
          <MenuItemLink
            to="/items"
            primaryText="Product Items"
            leftIcon={<ClassIcon />} // Left Icon for Income
            style={{ paddingLeft: 48 }}
          />

          {permission2 && (
            <MenuItemLink
              to="/PurchaseList"
              primaryText="Purchases"
              leftIcon={<Shop2Icon />} // Left Icon for Income
              style={{ paddingLeft: 48 }}
            />
          )}

          {permission3 && (
            <>
              <MenuItemLink
                to="/stock"
                primaryText="Stock"
                leftIcon={<Inventory2TwoToneIcon />} // Left Icon for Income
                style={{ paddingLeft: 48 }}
              />

              <MenuItemLink
                to="/products"
                primaryText="Product List"
                leftIcon={<ViewListIcon />} // Left Icon for Income
                style={{ paddingLeft: 48 }}
              />
            </>
          )}

          {permission2 && (
            <>
              <MenuItemLink
                to="/salesList"
                primaryText="Sales"
                leftIcon={<Inventory2OutlinedIcon />} // Left Icon for Income
                style={{ paddingLeft: 48 }}
              />

              <MenuItemLink
                to="/orders"
                primaryText="Orders"
                leftIcon={
                  <Badge badgeContent={processingOrders} color="error">
                    <ShoppingCartSharpIcon />{" "}
                  </Badge>
                }
                style={{ paddingLeft: 48 }}
              />
            </>
          )}
          <MenuItemLink
            to="/supplier"
            primaryText="Suppliers"
            leftIcon={<SendAndArchiveIcon />} // Left Icon for Income
            style={{ paddingLeft: 48 }}
          />

          <MenuItemLink
            to="/customers"
            primaryText="Customers"
            leftIcon={<GroupIcon />} // Left Icon for Income
            style={{ paddingLeft: 48 }}
          />
        </>
      )}

      {/*****Financial */}
      {permission2 && (
        <MenuItemLink
          to="#"
          primaryText={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Financial
              {openFinancial ? <ExpandLess /> : <ExpandMore />}
            </div>
          }
          leftIcon={<AccountBalanceIcon />}
          onClick={handleFinancialToggle}
          righticon={openFinancial ? <ExpandLess /> : <ExpandMore />}
        />
      )}
      {openFinancial && permission1 && (
        <MenuItemLink
          to="/financialReport"
          primaryText="Report"
          leftIcon={<MonetizationOnIcon />} // Left Icon for Income
          style={{ paddingLeft: 48 }}
        />
      )}
      {openFinancial && permission2 && (
        <>
          <MenuItemLink
            to="/otherIncomes"
            primaryText="Other Income"
            leftIcon={<ArrowDownwardIcon />} // Left Icon for Income
            style={{ paddingLeft: 48 }}
          />
          <MenuItemLink
            to="/otherExpenses"
            primaryText="Other Expense"
            leftIcon={<ArrowUpwardIcon />} // Left Icon for Expnse
            style={{ paddingLeft: 48 }}
          />

          <MenuItemLink
            to="/officeExpenses"
            primaryText="Office Expense"
            leftIcon={<PaymentsIcon />}
            style={{ paddingLeft: 48 }}
          />
        </>
      )}

      {permission1 && (
        <MenuItemLink
          to="/FinancialAnalaysis"
          primaryText="Sales Analysis"
          leftIcon={<InsightsIcon />}
        />
      )}

      {/**End of financial report */}

      {/* <MenuItemLink
        to="/articles"
        primaryText="Post & Articles"
        leftIcon={<ArticleIcon />}
      /> */}
      {permission1 && (
        <MenuItemLink
          to="/messages"
          primaryText="Messages"
          leftIcon={
            <Badge badgeContent={unreadMessages} color="error">
              <ChatIcon />
            </Badge>
          }
        />
      )}

      {permission1 && (
        <MenuItemLink
          to="/users"
          primaryText="Users"
          leftIcon={<PeopleAltOutlinedIcon />} // Left Icon for Income
        />
      )}

      <MenuItemLink
        to="/account"
        primaryText="Account"
        leftIcon={<ManageAccountsIcon />}
      />
    </Menu>
  );
};

export default CustomMenu;
