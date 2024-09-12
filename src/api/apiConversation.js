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

// /---------------------------------------------/
// /to create groupe /

export const fetchFriends = async () => {
  try {
    const response = await apiService.get("/friends-search");
    return response.data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

export const createGroup = async (groupData) => {
  try {
    const response = await apiService.post(
      "/create-conversation-groupe",
      groupData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

// /---------------------------------/

export const fetchPrivateConversations = async () => {
  try {
    const response = await apiService.get("/conversations/private");

    return response.data;
  } catch (error) {
    console.error("Error fetching private conversations:", error);
    throw error;
  }
};

export const fetchGroupConversations = async () => {
  try {
    const response = await apiService.get("/conversations/group");
    return response.data;
  } catch (error) {
    console.error("Error fetching group conversations:", error);
    throw error;
  }
};

/********************************************************************************/
/*ADD AND REMOVE  WHEN YOU'RE ADMIN OF THE GROUPE */
export const addParticipant = async ({ conversationId, userIds }) => {
  try {
    const response = await apiService.post("/add-participant", {
      conversationId,
      userIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding participant:", error);
    throw error;
  }
};

export const removeParticipant = async ({ conversationId, userId }) => {
  try {
    const response = await apiService.post("/remove-participant", {
      conversationId,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error removing participant:", error);
    throw error;
  }
};

/**********************************************************/

export const getIdOfConverstation = async (etudiantId) => {
  try {
    const response = await apiService.get(
      `/fetch-conversation?etudiantId=${etudiantId}`
    );
    const { conversationId } = response.data;

    // Vous pouvez ensuite utiliser cet ID pour naviguer vers la conversation ou pour d'autres actions
    return conversationId;
  } catch (error) {
    console.error("Error fetching advanced search results:", error);
    throw error;
  }
};
