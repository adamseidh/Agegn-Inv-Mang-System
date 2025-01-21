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

const CustomMenu = (props) => {
    const [openFinancial, setOpenFinancial] = useState(true);
    const [openPlanBudget, setOpenPlanBudget] = useState(false);
    const [openCashflow, setOpenCashflow] = useState(false);

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

    return (
        <Menu {...props}>
            {/* Static Menu Items */}
            <MenuItemLink to="/" primaryText="Dashboard" leftIcon={<DashboardIcon />} />
            <MenuItemLink to="/projects" primaryText="Projects" leftIcon={<GroupIcon />} />




        </Menu>
    );
};

export default CustomMenu;
