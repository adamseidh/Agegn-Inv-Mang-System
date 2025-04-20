import React from "react";
import { Admin, Resource, Layout } from "react-admin";
import { fetchUtils } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import LoginPage from "./pages/Auth/LoginPage";
import CustomMenu from "./components/CustomMenu";
import { BrowserRouter } from "react-router-dom";
import {
  EditIncome,
  Income,
  IncomeCrate,
  IncomeShow,
} from "./components/financial/plan&budget/Income";
import {
  EditExpense,
  ExpenseCreate,
  Expenses,
  ExpenseShow,
} from "./components/financial/plan&budget/expenses";
import {
  CashInflows,
  CashinflowsCreate,
  CashInflowShow,
  EditCashInflows,
} from "./components/financial/cashflow/CashInflows";
import {
  CashOutflows,
  CashoutflowsCreate,
  CashOutShow,
  EditCashOutflows,
} from "./components/financial/cashflow/cashoutflows";
import { createTheme } from "@mui/material";
import Dashboard from "./components/Dashboard/Dashboard";
import { Category, EditCategory, ShowCategory } from "./components/Category";
import { EditItem, Items, ShowItem } from "./components/Items";
import {
  CreateProduct,
  EditProduct,
  Products,
  ShowProduct,
} from "./components/Products";
import { EditSupplier, ShowSupplier, Supplier } from "./components/Supplier";
import { Stock } from "./components/stock";
import { EditStockout, showStockout, Stockout } from "./components/stockout";
import { Customers, EditCustomer, ShowCustomer } from "./components/Customer";
import { Orders } from "./components/Orders";

const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

const API_URL = `${serverHost}`;

// Authentication Provider
const authProvider = {
  login: ({ email, password }) => {
    if (email === "admin@example.com" && password === "password") {
      localStorage.setItem("auth", JSON.stringify({ email }));
      return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid username or password"));
  },
  logout: () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("auth") ? Promise.resolve() : Promise.reject(),
  checkError: () => Promise.resolve(),
  getPermissions: () => Promise.resolve(),
};

// Data Provider
const dataProvider = simpleRestProvider(API_URL, fetchUtils.fetchJson);

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#184784",
    },
    secondary: {
      main: "#184784",
    },
    background: {
      default: "#F7F7F7",
    },
  },
});
// Application Component
const App = () => (
  <BrowserRouter>
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      theme={customTheme}
      loginPage={LoginPage}
      dashboard={Dashboard}
      layout={(props) => (
        <Layout
          {...props}
          menu={(menuProps) => <CustomMenu {...menuProps} />}
        />
      )}
    >
      <Resource
        name="category"
        list={Category}
        show={ShowCategory}
        edit={EditCategory}
      />
      <Resource name="items" list={Items} show={ShowItem} edit={EditItem} />
      <Resource name="stock" list={Stock} />
      <Resource
        name="products"
        list={Products}
        show={ShowProduct}
        edit={EditProduct}
        create={CreateProduct}
      />
      <Resource
        name="stockouts"
        list={Stockout}
        show={showStockout}
        edit={EditStockout}
      />
      <Resource name="orders" list={Orders} />
      <Resource
        name="supplier"
        list={Supplier}
        show={ShowSupplier}
        edit={EditSupplier}
      />
      <Resource
        name="customers"
        list={Customers}
        show={ShowCustomer}
        edit={EditCustomer}
      />

      <Resource
        name="income"
        list={Income}
        options={{ label: "Income" }}
        create={IncomeCrate}
        edit={EditIncome}
        show={IncomeShow}
      />
      {/* Financial Resources */}
      <Resource
        name="income"
        list={Income}
        options={{ label: "Income" }}
        create={IncomeCrate}
        edit={EditIncome}
        show={IncomeShow}
      />
      <Resource
        name="expenses"
        list={Expenses}
        options={{ label: "Expense" }}
        create={ExpenseCreate}
        edit={EditExpense}
        show={ExpenseShow}
      />
      <Resource
        name="cashinflows"
        list={CashInflows}
        options={{ label: "Cash Inflows" }}
        create={CashinflowsCreate}
        edit={EditCashInflows}
        show={CashInflowShow}
      />
      <Resource
        name="cashoutflows"
        list={CashOutflows}
        options={{ label: "Cash Outflows" }}
        create={CashoutflowsCreate}
        edit={EditCashOutflows}
        show={CashOutShow}
      />
    </Admin>
  </BrowserRouter>
);

export default App;
