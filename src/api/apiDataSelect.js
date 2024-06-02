import axios from "axios";

const BASE_URL = "http://localhost:1337/api";

export const fetchDataAndStore = async (token) => {
  try {
    const [parcoursResponse, modulesResponse, lessonsResponse] =
      await Promise.all([
        axios.get(`${BASE_URL}/get-all-parcours`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/get-all-modules`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/get-all-lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

    const parcours = parcoursResponse.data;
    const modules = modulesResponse.data;
    const lessons = lessonsResponse.data;

    localStorage.setItem("parcours", JSON.stringify(parcours));
    localStorage.setItem("modules", JSON.stringify(modules));
    localStorage.setItem("lessons", JSON.stringify(lessons));
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getParcoursFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("parcours")) || [];
};

export const getModulesFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("modules")) || [];
};

export const getLessonsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("lessons")) || [];
};
