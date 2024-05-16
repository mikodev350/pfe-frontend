// import axios from "axios";
// import { getToken } from "../util/authUtils";
// import { API_BASE_URL } from "../constants/constante";


import data  from './fakeData/fakeResource.json';




// const token = getToken();
// const head = {
//   Authorization: `Bearer ${token}`,
// };



export const fetchResources = async (currentPage, pageSize, sectionid, searchValue, token) => {
  try {
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    console.log("sectionid")

    console.log(sectionid)
    // Filtering data based on sectionid and searchValue
    const filteredData = data.data.filter(resource => {
      return (sectionid ? parseInt(resource.sectionId) === parseInt(sectionid) : true) &&
             (searchValue ? resource.name.toLowerCase().includes(searchValue.toLowerCase()) : true);
    });

    // Pagination logic
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    // Creating a response structure similar to an actual API
    const response = {
      data: paginatedData,
      totalPages: Math.ceil(filteredData.length / pageSize)
    };

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;  // Rethrow the error for the caller to handle if necessary
  }
};
// export const fetchResources = async (currentPage, pageSize, sectionid, seachValue, token) => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/resources?page=${currentPage}&pageSize=${pageSize}&section=${sectionid}&title=${seachValue}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     if (!response.ok) {
//       throw new Error("Error fetching data");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// export const fetchArchiveResources = async (currentPage, pageSize, sectionid, seachValue, token) => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/archive-resources?page=${currentPage}&pageSize=${pageSize}&sectionId=${sectionid}&title=${seachValue}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     console.log("====================================");
//     console.log(response);
//     console.log("====================================");
//     if (!response.ok) {
//       throw new Error("Error fetching data");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// export const getAllResourcesForStudent = async (currentPage, pageSize, sectionId, title, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/custom-section-resource`, {
//       params: {
//         section: Number(sectionId),
//         title: title,
//         page: currentPage,
//         pageSize: pageSize,
//       },
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!response.data) {
//       throw new Error("No response data received");
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// export const fetchResourceById = async (resourceId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/resources/${resourceId}`, {
//       headers: head,
//     });
//     if (!response.data || response.data?.data === null) {
//       throw new Error("No resource data received");
//     }
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching resource data:", error);
//     throw error;
//   }
// };

// export const saveResource = async (data, id, token) => {
//   if (data.isPublic) {
//     data.resourceStartDate = null;
//     data.resourceEndDate = null;
//   } else if (!data.negativePoint) {
//     data.numberNegativePoint = 0;
//   } else if (!data.randomQuestion && !data.randomQuestionOptions) {
//     data.numberOfdisplayQuestions = 0;
//   }
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/resources?sectioId=${id}`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.data) {
//       throw new Error("No response data received");
//     }

//     return response.data.data;
//   } catch (error) {
//     console.error("Error saving data:", error);
//     throw error;
//   }
// };

// export const updateResourceItem = async (data, token, resourceId) => {
//   if (data.isPublic) {
//     data.resourceStartDate = null;
//     data.resourceEndDate = null;
//   } else if (!data.negativePoint) {
//     data.numberNegativePoint = 0;
//   } else if (!data.randomQuestion && !data.randomQuestionOptions) {
//     data.numberOfdisplayQuestions = 0;
//   }
//   try {
//     const response = await axios.put(`${API_BASE_URL}/resources/${resourceId}`, data, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.data) {
//       throw new Error("No response data received");
//     }

//     return response.data.data;
//   } catch (error) {
//     console.error("Error updating data:", error);
//     throw error;
//   }
// };

// export const getOneResource = async (id, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/resources/${id}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (response.data == null) {
//       console.error("Error fetching section:");
//     }
//     const data = response.data;
//     return data;
//   } catch (error) {
//     console.error("Error fetching section:", error);
//     throw error;
//   }
// };
