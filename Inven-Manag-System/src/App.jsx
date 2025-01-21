import React from "react";
import { Admin, Resource, Layout } from "react-admin";
import { fetchUtils } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { BrowserRouter } from "react-router-dom";
import { createTheme } from "@mui/material";
import LoginPage from "./Pages/Auth/LoginPage";
import Dashboard from "./Components/Dashboard";
import { Projects } from "./Components/Projects";
import CustomMenu from "./Components/CustomMenu";

const serverHost = import.meta.env.VITE_REACT_APP_SERVER

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
      main: "#056839",
    },
    secondary: {
      main: "#056839",
    },
    background: {
      default: "#F7F7F7",
    },
  }
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
      layout={(props) => <Layout {...props} menu={(menuProps) => <CustomMenu {...menuProps} />} />}
    >
      <Resource name="projects" list={Projects} />

    </Admin>
  </BrowserRouter>
);

export default App;
