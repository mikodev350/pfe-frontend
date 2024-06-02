import axios from "axios";
import { API_BASE_URL } from "../constants/constante"; // Make sure to define your API base URL in constants

// Fetch lessons with pagination, search, and moduleId
export const fetchLessons = async (page, token, search = "", moduleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lessons`, {
      params: {
        _page: page,
        _limit: 5,
        _q: search,
        moduleId: moduleId,
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
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

export const createLesson = async (lessonData, moduleId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/lessons`,
      {
        ...lessonData,
        module: moduleId, // Include moduleId in the lesson data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating lesson:", error);
    throw error;
  }
};
// Update an existing lesson
export const updateLesson = async (lessonId, lesson, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/lessons/${lessonId}`,
      { data: lesson },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
};
