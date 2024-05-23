import parcoursData from "./fakeData/fakeParcours.json";

// Fetch parcours from fake data
export const fetchParcours = async (currentPage, search = "") => {
  try {
    // Filter and paginate the fake data
    const filteredData = parcoursData.parcours.filter((parcours) =>
      parcours.name.toLowerCase().includes(search.toLowerCase())
    );
    const pageSize = 5;
    const paginatedData = filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return {
      data: paginatedData,
      totalPages: Math.ceil(filteredData.length / pageSize),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// import axios from "axios";

// const API_URL = "your-api-url";

// export const fetchParcours = async (page, token, search = "") => {
//   const response = await axios.get(`${API_URL}/parcours`, {
//     params: { page, search },
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   return response.data;
// };

// import axios from "axios";
// import { API_BASE_URL } from "../constants/constante";
// import { getToken } from "../util/authUtils";

// // Fetch token from authUtils
// const token = getToken();

// // Fetch parcours from API
// export const fetchParcours = async (currentPage, token, search = "") => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/parcours`, {
//       params: { page: currentPage, search },
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };
