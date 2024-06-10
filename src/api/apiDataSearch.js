// apiService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:1337/api";

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchAdvancedSearch = async (params) => {
  try {
    const response = await apiService.get("/custom-search/advanced", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching advanced search results:", error);
    throw error;
  }
};

export const fetchUserSearch = async (params) => {
  try {
    console.log("Loading...");
    const response = await apiService.get("/custom-search/users", { params });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user search results:", error);
    throw error;
  }
};

export default apiService;
