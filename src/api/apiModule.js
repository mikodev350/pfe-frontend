import axios from "axios";
import { API_BASE_URL } from "../constants/constante";

export const fetchModules = async (page, token, search, idParcours) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/modules`, {
      params: {
        _page: page,
        _limit: 5,
        _q: search,
        parcour: idParcours,
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

export const updateModule = async (id, data, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/modules/${id}`,
      { data },
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

export const createModule = async (moduleData, token) => {
  const response = await axios.post(`${API_BASE_URL}/modules`, moduleData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
