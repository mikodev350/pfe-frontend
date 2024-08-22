import axios from "axios";
import { getToken } from "./../util/authUtils";

const API_BASE_URL = "http://localhost:1337/api";

export const fetchDevoirs = async (page, pageSize, searchValue, token) => {
  const params = {
    _page: page,
    _limit: pageSize,
    _q: searchValue,
  };

  const response = await axios.get(`${API_BASE_URL}/devoirs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data;
};

export const createDevoir = async (devoir, token) => {
  const response = await axios.post(`${API_BASE_URL}/devoirs`, devoir, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateDevoir = async (id, devoir, token) => {
  const response = await axios.put(`${API_BASE_URL}/devoirs/${id}`, devoir, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteDevoir = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/devoirs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchDevoirById = async (id, token, type = "devoir") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/devoirs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { type }, // Ajout du paramètre type dans la requête
    });

    console.log("response.data");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du devoir:", error);
    throw error;
  }
};

export const fetchForModelDevoirs = async (token) => {
  console.log("this is token");
  console.log(token);
  const response = await axios.get(`${API_BASE_URL}/devoirs/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createAssignation = async (
  newAssignation,
  token,
  TypeOfasssignation
) => {
  const data = {
    ...newAssignation,
    TypeOfasssignation: TypeOfasssignation,
  };
  console.log("-----------------------------------------------");
  console.log("data of createAssignation ");
  console.log(data);
  console.log("-----------------------------------------------");

  const response = await axios.post(`${API_BASE_URL}/assignations`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/****************************************************************************/

// Fonction pour récupérer les assignations
export const fetchAssignations = async (
  group,
  TypeElement,
  type,
  IdEtudiant
  // token
) => {
  const params = {
    group: group,
    type: type.toUpperCase(),
    TypeElement: TypeElement,
    etudantId: IdEtudiant,
  };
  console.log("params");

  console.log(params);
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/assignations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data;
};
/**********************************************************************************************************/
export const fetchOneDevoir = async (id, token) => {
  try {
    console.log("====================================");
    console.log("id");
    console.log(id);
    console.log("====================================");
    console.log("token");
    console.log(token);
    console.log("====================================");
    const response = await axios.get(`${API_BASE_URL}/devoirs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du devoir:", error);
    throw error;
  }
};
/******************************************************/
// Delete an Assignation
// / Fonction pour supprimer une assignation
export const deleteAssignation = async (
  id,
  groupId,
  TypeElement,
  type,
  token
) => {
  try {
    const params = {
      groupId: groupId,
      TypeElement: TypeElement,
      type: type,
    };

    const response = await axios.delete(`${API_BASE_URL}/assignations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to delete assignation", error);
    throw new Error("Failed to delete assignation");
  }
};

/**************************************************************************************************************/
export const fetchStudentAssignations = async (token) => {
  console.log("fetchStudentAssignations");
  try {
    const response = await axios.get(
      `${API_BASE_URL}/assignations-custom/student`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des assignations de l'étudiant :",
      error
    );
    throw error;
  }
};

/****************************************************************************/
/***************    fetch ell Exammm    ******************************/

/******************************************************************************/
