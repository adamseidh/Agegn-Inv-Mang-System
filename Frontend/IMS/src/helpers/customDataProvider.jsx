import { fetchUtils } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { TokenExpired } from "./functions/tokenExpiration";

// Import the API base URL
const serverHost = import.meta.env.VITE_REACT_APP_SERVER;
const API_URL = `${serverHost}`;

// Helper function to add the JWT token to the headers
const fetchJsonWithJWT = (url, options = {}) => {
  const gettoken = localStorage.getItem("token");
  const token = JSON.parse(gettoken).token;
  const isTokenExpired = TokenExpired(token);
  if (isTokenExpired) {
    console.log("token expired");
    window.location.href = "/login";
  }
  if (!token) {
    throw new Error("No JWT token found. Please log in.");
  }

  // Add the Authorization header with the JWT token
  options.headers = new Headers({
    ...options.headers,
    Authorization: `Bearer ${token}`,
  });

  return fetchUtils.fetchJson(url, options);
};

// Initialize the default dataProvider with the custom fetch function
const dataProvider = simpleRestProvider(API_URL, fetchJsonWithJWT);

// Custom Data Provider
const customDataProvider = {
  ...dataProvider, // Spread the default dataProvider for default behavior

  getList: async (resource, params) => {
    if (resource === "account") {
      // Custom implementation for `accounts`
      const { userId, role } = params.filter; // Get userId and role from filters
      console.log("user id from", params);
      console.log("here role from filter", role);
      console.log("user id from filter", userId);

      if (!userId) {
        throw new Error("User ID is required for fetching accounts.");
      }

      try {
        const response = await fetchJsonWithJWT(
          `${API_URL}/account?userId=${userId}&role=${role}`
        );
        return {
          data: response.json, // The list of accounts
          total: response.json.length, // Total count
        };
      } catch (error) {
        console.error("Error fetching accounts:", error);
        throw new Error("Error fetching accounts");
      }
    }

    if (resource === "officeExpenses") {
      // Custom implementation for `officeExpenses`
      const getId = localStorage.getItem("userId");
      const userId = JSON.parse(getId).userId;

      if (!userId) {
        throw new Error("User ID is required for fetching data.");
      }

      try {
        // Get pagination and sorting from params
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        // Construct the URL with all necessary parameters
        const url = `${API_URL}/officeExpenses?userId=${userId}&_page=${page}&_limit=${perPage}&_sort=${field}&_order=${order.toLowerCase()}`;

        const response = await fetchJsonWithJWT(url);

        return {
          data: response.json,
          total: parseInt(
            response.headers.get("content-range").split("/")[1],
            10
          ), // Get total from Content-Range header
        };
      } catch (error) {
        console.error("Error fetching office expenses:", error);
        throw new Error("Error fetching office expenses");
      }
    }

    if (resource === "officeExpenseDetails") {
      // Custom implementation for `accounts`
      const officeExpId = sessionStorage.getItem("officeExpId"); // Get user id when the user logged in

      if (!officeExpId) {
        console.log("office exp id from data provider", officeExpId);
        throw new Error("officeExpId is required for fetching accounts.");
      }

      try {
        const response = await fetchJsonWithJWT(
          `${API_URL}/officeExpenseDetails?officeExpId=${officeExpId}`
        );
        return {
          data: response.json, // The list of accounts
          total: response.json.length, // Total count
        };
      } catch (error) {
        console.error("Error fetching accounts:", error);
        throw new Error("Error fetching accounts");
      }
    }

    // Default behavior for other resources
    return dataProvider.getList(resource, params);
  },

  getOne: async (resource, params) => {
    if (resource === "account") {
      // Custom logic for getting one account
      try {
        const response = await fetchJsonWithJWT(
          `${API_URL}/account/${params.id}`
        );
        return { data: response.json };
      } catch (error) {
        console.error("Error fetching account:", error);
        throw new Error("Error fetching account");
      }
    }

    // Default behavior for other resources
    return dataProvider.getOne(resource, params);
  },
};

export default customDataProvider;
