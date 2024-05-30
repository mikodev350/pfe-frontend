import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
export const fetchParcours = async (page, search, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/parcours`, {
      params: {
        _page: page,
        _limit: 5,
        _q: search,
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
    console.error("Error fetching parcours:", error);
    throw error;
  }
};

export const createPathway = async (pathwayData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/parcours`,
      { data: pathwayData },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error creating pathway:", error);
    throw error;
  }
};
