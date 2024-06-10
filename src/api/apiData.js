const fakeData = {
  parcours: [
    { id: 4, name: "Parcours 1" },
    { id: 2, name: "Parcours 2" },
  ],
  modules: [
    { id: 1, name: "Module 1", parcoursId: 4 },
    { id: 2, name: "Module 2", parcoursId: 4 },
    { id: 3, name: "Module 3", parcoursId: 2 },
    { id: 4, name: "Module 4", parcoursId: 2 },
    { id: 5, name: "Module 5", parcoursId: 2 },
  ],
  lessons: [
    { id: 1, name: "Lesson 1", moduleId: 1 },
    { id: 2, name: "Lesson 2", moduleId: 2 },
    { id: 3, name: "Lesson 3", moduleId: 3 },
    { id: 4, name: "Lesson 4", moduleId: 4 },
    { id: 5, name: "Lesson 5", moduleId: 5 },
  ],
  resources: [
    { id: 1, name: "Resource 1" },
    { id: 2, name: "Resource 2" },
    { id: 3, name: "Resource 3" },
    { id: 4, name: "Resource 4" },
    { id: 5, name: "Resource 5" },
  ],
  subjects: [
    { id: 1, name: "Math" },
    { id: 2, name: "Science" },
    { id: 3, name: "History" },
    { id: 4, name: "Geography" },
    { id: 5, name: "English" },
  ],
  levels: [
    { id: 1, name: "Primary" },
    { id: 2, name: "Middle" },
    { id: 3, name: "High" },
    { id: 4, name: "University" },
  ],
  teachers: [
    { id: 1, name: "Teacher 1", subjectId: 1, levelId: 1 },
    { id: 2, name: "Teacher 2", subjectId: 2, levelId: 2 },
    { id: 3, name: "Teacher 3", subjectId: 3, levelId: 3 },
    { id: 4, name: "Teacher 4", subjectId: 4, levelId: 4 },
    { id: 5, name: "Teacher 5", subjectId: 5, levelId: 1 },
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

export const getResources = async () => {
  return fakeData.resources;
};

export const getSubjects = async () => {
  return fakeData.subjects;
};

export const getLevels = async () => {
  return fakeData.levels;
};

export const getAllTeachers = async () => {
  return fakeData.teachers;
};
