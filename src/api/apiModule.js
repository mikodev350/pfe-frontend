import axios from "axios";
import { API_BASE_URL } from "../constants/constante"; // Make sure to define your API base URL in constants

// Fetch modules with pagination, search, and parcoursId
export const fetchModules = async (page, token, search = "", parcoursId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/modules`, {
      params: {
        _page: page,
        _limit: 5,
        _q: search,
        parcour: parcoursId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response.data.data,
      totalPages: Math.ceil(response.data.meta.pagination.total / 5),
    };
  } catch (error) {
    console.error("Error fetching modules:", error);
    throw error;
  }
};

export const createModule = async (moduleData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/modules`, moduleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating module:", error);
    throw error;
  }
};

// Update an existing module
export const updateModule = async (moduleId, module, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/modules/${moduleId}`,
      { data: module },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
};

//ici delete the module
export const deleteModule = async (moduleId, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/modules/${moduleId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting module:", error);
    throw error;
  }
};
