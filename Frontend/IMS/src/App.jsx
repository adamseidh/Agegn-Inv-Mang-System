import React, { useEffect, useState } from "react";
import { Admin, Resource, Layout, CustomRoutes } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import { createTheme } from "@mui/material";
import CryptoJS from "crypto-js";
import axios from "axios";
import Dashboard from "./Components/Dashboard/Dashboard";
import customDataProvider from "./helpers/customDataProvider";
import LoginPage from "./pages/auth/LoginPage";
import { EditAccount, MyAccount, ShowAccount } from "./pages/auth/myAccount";
import {
  Articles,
  CreateArticle,
  EditArticle,
  ShowAnArticle,
} from "./Components/Articles";
import { Messages, ShowMessage } from "./Components/Messages";
import {
  Category,
  EditCategory,
  ShowCategory,
} from "./Components/Inventory/ProductCategory";
import {
  EditProductType,
  ProductType,
  ShowProductType,
} from "./Components/Inventory/ProductType";
import {
  CreateItem,
  EditItem,
  Items,
  ShowAnItem,
} from "./Components/Inventory/Items/items";
import {
  CreateSupplier,
  EditSupplier,
  ShowSupplier,
  Supplier,
} from "./Components/Inventory/suppliers";
import { PurchaseList } from "./Components/Inventory/PurchaseList";
import AddPurchase from "./Components/Inventory/PurchaseList/addPurchase";
import PurchasedProductList from "./Components/Inventory/PurchaseList/PurchasedProductList";
import { Products, ShowProduct } from "./Components/Inventory/stock/products";
import { Stock } from "./Components/Inventory/stock/stock";
import {
  CreateCustomer,
  Customer,
  EditCustomer,
  ShowCustomer,
} from "./Components/Inventory/customers";
import { SalesList } from "./Components/Inventory/Sales/SalesList";
import SellProduct from "./Components/Inventory/Sales/sellProduct";
import Checkout from "./Components/Inventory/Sales/checkout";
import SalesListDetail from "./Components/Inventory/Sales/salesListDetail";
import FinancialReport from "./Components/Financial/FinancialReport";
import { OrdersList } from "./Components/Inventory/Orders/OrdersList";
import OrdersDetail from "./Components/Inventory/Orders/OrdersDetail";
import { CreateUser, EditUser, Users } from "./Components/Users";
import MyLayout from "./customAppBar/Layout";
import NotificationsList from "./Components/Notifications/NotificationsList";

const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

const API_URL = `${serverHost}`;

const UserAuthentication = async (email, password) => {
  try {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const response = await axios.post(`${API_URL}/getUser`, {
      email,
      password: hashedPassword,
    });
    const role = response.data.user.role;
    const userId = response.data.user.id;
    const token = response.data.token;
    console.log("response data aftett dotenv ", response.data);
    console.log("here is the uer id :", userId);
    localStorage.setItem("role", JSON.stringify({ role }));
    localStorage.setItem("userId", JSON.stringify({ userId }));
    localStorage.setItem("token", JSON.stringify({ token }));

    ////////////////

    /// testin fetching articles with token

    /// fetching the user data with the user id;

    console.log("here is full of the user data", response.data.user);

    return response.data.success;
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
};

// Authentication Provider
const authProvider = {
  login: async ({ email, password }) => {
    const userValid = await UserAuthentication(email, password);
    console.log("user valid", userValid);
    if (userValid) {
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
//const dataProvider = simpleRestProvider(API_URL, fetchUtils.fetchJson);

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#184784", //#dc2626
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
const App = () => {
  return (
    <BrowserRouter>
      <Admin
        dataProvider={customDataProvider}
        authProvider={authProvider}
        theme={customTheme}
        loginPage={LoginPage}
        dashboard={Dashboard}
        layout={MyLayout}
      >
        <CustomRoutes>
          <Route path="/PurchaseList/create" element={<AddPurchase />} />
        </CustomRoutes>
        <CustomRoutes>
          <Route path="/salesList/create" element={<SellProduct />} />
        </CustomRoutes>
        <CustomRoutes>
          <Route path="/salesList/:id/show" element={<SalesListDetail />} />
        </CustomRoutes>
        <CustomRoutes>
          <Route path="/orders/:id/show" element={<OrdersDetail />} />
        </CustomRoutes>
        <CustomRoutes>
          <Route path="/checkout" element={<Checkout />} />
        </CustomRoutes>

        <CustomRoutes>
          <Route path="/financialReport" element={<FinancialReport />} />
        </CustomRoutes>
        <CustomRoutes>
          <Route
            path="/PurchaseList/:id/show"
            element={<PurchasedProductList />}
          />
        </CustomRoutes>

        <CustomRoutes>
          <Route path="/notifications" element={<NotificationsList />} />
        </CustomRoutes>
        <Resource
          name="articles"
          list={Articles}
          edit={EditArticle}
          create={CreateArticle}
          show={ShowAnArticle}
        />
        <Resource
          name="account"
          list={MyAccount}
          edit={EditAccount}
          show={ShowAccount}
        />

        <Resource
          name="users"
          list={Users}
          create={CreateUser}
          edit={EditUser}
        />
        <Resource name="messages" list={Messages} show={ShowMessage} />
        <Resource
          name="category"
          list={Category}
          options={{ label: "Product Category" }}
          show={ShowCategory}
          edit={EditCategory}
        />
        <Resource
          name="productType"
          options={{ label: "Product Type" }}
          list={ProductType}
          show={ShowProductType}
          edit={EditProductType}
        />
        <Resource
          name="items"
          options={{ label: "Product  Names" }}
          list={Items}
          show={ShowAnItem}
          edit={EditItem}
          create={CreateItem}
        />
        <Resource
          name="supplier"
          list={Supplier}
          show={ShowSupplier}
          edit={EditSupplier}
          create={CreateSupplier}
        />

        <Resource
          name="customers"
          list={Customer}
          show={ShowCustomer}
          edit={EditCustomer}
          create={CreateCustomer}
        />
        <Resource
          name="products"
          list={Products}
          show={ShowProduct}
          options={{ label: "Available Products Detail" }}
        />
        <Resource
          name="stock"
          list={Stock}
          options={{ label: "Available Stocks" }}
        />

        <Resource name="PurchaseList" list={PurchaseList} />
        <Resource name="salesList" list={SalesList} />
        <Resource name="orders" list={OrdersList} />
      </Admin>
    </BrowserRouter>
  );
};

export default App;
