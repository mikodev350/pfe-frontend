import { API_BASE_URL } from "../constants/constante";
import { getToken } from "../util/authUtils";
import axios from "axios";
import sections  from './fakeData/fakeSections.json';

const token = getToken();



export const fetchSections = async (currentPage, token, name) => {
  try {
    // Afficher les données importées

    // Pas besoin d'utiliser .json(), car les données sont déjà sous forme d'objet JavaScript
    // Utilisez directement les données importées
    const filteredData = sections.sections.filter(section => section.name.includes(name));
    const paginatedData = filteredData.slice((currentPage - 1) * 10, currentPage * 10);

    // Simuler une structure de réponse comme celle attendue d'axios
    return {
      data: paginatedData,
      totalPages: Math.ceil(filteredData.length / 10)
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


export const addSection = (name) => {
  try {
    // Charger les données existantes depuis le localStorage
    const storedSections = localStorage.getItem('sections');
    let sections = storedSections ? JSON.parse(storedSections) : { sections: [] };

    // Générer un nouvel identifiant pour la nouvelle section
    const newId = sections.sections.length + 1;

    // Créer l'objet de la nouvelle section
    const newSection = {
      id: newId,
      name: name,
      totalresource: 5,
      createdAt: new Date().toISOString()
    };

    // Ajouter la nouvelle section aux données des sections
    sections.sections.push(newSection);

    // Écrire les données mises à jour dans le localStorage
    localStorage.setItem('sections', JSON.stringify(sections));

    // Retourner les données des sections mises à jour
    return sections;
  } catch (error) {
    console.error("Error adding section:", error);
    throw error;
  }
};
/****************************************************************************************/
/*********************API SECTION WITH BACK END *********************************/  


// export const fetchSections = async (currentPage, token, name) => {
//   try {
//     const response = await axios.get(
//       `http://localhost:1337/api/sections?page=${currentPage}&name=${name}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );



//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// export const getAllSectionsWithoutPagination = async (token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/section-exam`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// export const addSection = async (name) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/sections`,
//       {
//         name,
//         totalExams: 0,
//         createdAt: new Date().toString(),
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data.data;
//   } catch (error) {
//     console.error("Error adding section:", error);
//     throw error;
//   }
// };

export const updateSection = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/sections/${id}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
};

// export const getSectionForExam = async (id, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/sections/${id}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching section:", error);
//     throw error;
//   }
// };

// export const getTokensection = async (id, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/tokensection/${id}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.data.registrationLink) {
//       throw new Error("No registration link found in the response");
//     }

//     return response.data.registrationLink;
//   } catch (error) {
//     console.error("Error fetching tokensection:", error);
//     throw error;
//   }
// };

// export const fetchSubscribeSections = async (currentPage, token, search) => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/subscribe-sections?page=${currentPage}&search=${search}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// export const getSizeRequestStudent = async (idsection, token) => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/section-subscribe/${idsection}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };
