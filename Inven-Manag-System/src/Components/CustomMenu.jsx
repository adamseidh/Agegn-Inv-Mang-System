import React, { useState } from "react";
import { Menu, MenuItemLink } from "react-admin";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group"; // Icon for Traders
import ReportProblemIcon from "@mui/icons-material/ReportProblem"; // Icon for Complains
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ClassIcon from '@mui/icons-material/Class';
import ViewListIcon from '@mui/icons-material/ViewList';
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import Shop2Icon from '@mui/icons-material/Shop2';
const CustomMenu = (props) => {
    const [openFinancial, setOpenFinancial] = useState(true);
    const [openPlanBudget, setOpenPlanBudget] = useState(false);
    const [openCashflow, setOpenCashflow] = useState(false);
    //inventory
    const [openInventory, setOpenInventory] = useState(true);

    // Toggle Financial Menu
    const handleInventoryToggle = (event) => {
        event.preventDefault(); // Prevent navigation to `undefined`
        setOpenInventory(!openInventory);
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

    return (
        <Menu {...props} >
            {/* Static Menu Items */}
            <MenuItemLink to="/" primaryText="Dashboard" leftIcon={<DashboardIcon />} />

            {/**Collapsible Inventory */}

            <MenuItemLink
                to="#"
                primaryText={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                        to="/items"
                        primaryText="Items"
                        leftIcon={<ClassIcon />} // Left Icon for Income
                        style={{ paddingLeft: 48 }}
                    />

                    <MenuItemLink
                        to="/products/create"
                        primaryText="Purchase"
                        leftIcon={<Shop2Icon />} // Left Icon for Income
                        style={{ paddingLeft: 48 }}
                    />


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
                    <MenuItemLink
                        to="/stockouts"
                        primaryText="Sold Stock"
                        leftIcon={<Inventory2OutlinedIcon />} // Left Icon for Income
                        style={{ paddingLeft: 48 }}
                    />
                    <MenuItemLink
                        to="/orders"
                        primaryText="Orders"
                        leftIcon={<ShoppingCartSharpIcon />} // Left Icon for Income
                        style={{ paddingLeft: 48 }}
                    />

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




        </Menu>
    );
};

export default CustomMenu;
