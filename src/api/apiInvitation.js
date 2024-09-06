import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import { getToken } from "../util/authUtils";

export const fetchPendingInvitations = async () => {
  // Mock data
  const mockData = [
    {
      id: 1,
      sender: {
        username: "john_doe",
        email: "john@example.com",
      },
      token: "token123",
    },
    {
      id: 2,
      sender: {
        username: "jane_doe",
        email: "jane@example.com",
      },
      token: "token456",
    },
  ];

  // Simulate a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1000);
  });
};
export const fetchInvitations = async (type = "AMIS") => {
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/pending-relations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      type, // Ajout d'un paramètre pour filtrer par type d'invitation
    },
  });

  console.log("====================================");
  console.log(`Fetched ${type} invitations:`, response.data);
  console.log("====================================");

  return response.data;
};
export const acceptInvitation = async (token) => {
  // Simulate accepting the invitation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === "token123" || token === "token456") {
        resolve({ message: "Invitation accepted" });
      } else {
        reject(new Error("Invalid token"));
      }
    }, 1000);
  });
};

export const fetchAcceptedInvitationFriend = async (type) => {
  const token = getToken();

  const response = await axios.get(`${API_BASE_URL}/relations/accepted`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      type, // Le type de relation (AMIS ou COACHING)
    },
  });
  return response.data;
};

/***********************************************************************************************/
// Fonction pour récupérer la liste des amis
export const fetchRelationFriends = async () => {
  const token = getToken(); // Récupérer le token de l'utilisateur connecté

  try {
    const response = await axios.get(
      `${API_BASE_URL}/relations/find-relation-friends`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
        },
      }
    );

    console.log("====================================");
    console.log("Fetched friends relations:", response.data);
    console.log("====================================");

    return response.data; // Retourner la liste des relations d'amis
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des relations d'amis:",
      error
    );
    throw new Error("Impossible de récupérer les relations d'amis");
  }
};
