import axios from "axios";
import { API_BASE_URL } from "../constants/constante";



export const saveResource = async (resourceData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resources`, resourceData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error saving resource:', error);
    throw error;
  }
};

export const fetchResources = async (currentPage, pageSize, sectionid, searchValue, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: currentPage,
        pageSize: pageSize,
        section: sectionid,
        search: searchValue,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching resources:", error);
    throw error;
  }
};

export const getResourceById = async (id, token) => {
  const response = await axios.get(`${API_BASE_URL}/resources/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateResource = async (id, data, token) => {
  const response = await axios.put(`${API_BASE_URL}/resources/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Add the delete function here
export const deleteResource = async (id, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/resources/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};
