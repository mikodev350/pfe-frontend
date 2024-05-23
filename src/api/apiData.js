// src/api/apiData.js

const fakeData = {
  parcours: [
    { id: 1, name: "Parcours 1" },
    { id: 2, name: "Parcours 2" },
  ],
  modules: [
    { id: 1, name: "Module 1", parcoursId: 1 },
    { id: 2, name: "Module 2", parcoursId: 1 },
    { id: 3, name: "Module 3", parcoursId: 2 },
    { id: 4, name: "Module 4", parcoursId: 2 },
    { id: 5, name: "Module 5", parcoursId: 2 },
  ],
  lessons: [
    { id: 1, name: "Lesson 1", moduleId: 1 },
    { id: 2, name: "Lesson 2", moduleId: 2 },
    { id: 3, name: "Lesson 3", moduleId: 3 },
    { id: 4, name: "Lesson 3", moduleId: 3 },
    { id: 5, name: "Lesson 3", moduleId: 3 },
  ],
};

export const getAllParcours = async () => {
  return fakeData.parcours;
};

export const getModulesByParcours = async (parcoursIds) => {
  return fakeData.modules.filter((module) =>
    parcoursIds.includes(module.parcoursId)
  );
};

export const getLessonsByModule = async (moduleIds) => {
  return fakeData.lessons.filter((lesson) =>
    moduleIds.includes(lesson.moduleId)
  );
};
