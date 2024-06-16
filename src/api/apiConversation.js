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

export const fetchConversations = async () => {
  try {
    const response = await apiService.get("/conversations");
    return response.data;
  } catch (error) {
    console.error("Error fetching advanced search results:", error);
    throw error;
  }
};
export const fetchConversation = async ({ id }) => {
  try {
    const response = await apiService.get(`/conversation/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching advanced search results:", error);
    throw error;
  }
};
export const addMessage = async ({ data }) => {
  try {
    const { id } = data;
    const response = await apiService.post(`/conversation/${id}`, { data });
    return response.data;
  } catch (error) {
    console.error("Error fetching advanced search results:", error);
    throw error;
  }
};
