import lessonsData from "./fakeData/fakeLessons.json";

export const fetchLessons = async (currentPage, token, name, idModule) => {
  try {
    const filteredData = lessonsData.lessons.filter(
      (lesson) => lesson.name.includes(name) && lesson.idModule === idModule
    );
    const paginatedData = filteredData.slice(
      (currentPage - 1) * 10,
      currentPage * 10
    );

    return {
      data: paginatedData,
      totalPages: Math.ceil(filteredData.length / 10),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Function to simulate adding a lesson
export const addLesson = async (lesson) => {
  try {
    // Load existing lessons from localStorage or use the initial fake data
    const storedLessons = localStorage.getItem("lessons");
    let lessons = storedLessons
      ? JSON.parse(storedLessons)
      : { lessons: lessonsData.lessons };

    // Generate a new ID for the lesson
    const newId = lessons.lessons.length + 1;

    // Create the new lesson object
    const newLesson = {
      id: newId,
      ...lesson,
      createdAt: new Date().toISOString(),
    };

    // Add the new lesson to the lessons array
    lessons.lessons.push(newLesson);

    // Store the updated lessons array in localStorage
    localStorage.setItem("lessons", JSON.stringify(lessons));

    // Return the updated lessons
    return lessons;
  } catch (error) {
    console.error("Error adding lesson:", error);
    throw error;
  }
};

export const updateLesson = async (lesson) => {
  try {
    const storedLessons = localStorage.getItem("lessons");
    let lessons = storedLessons ? JSON.parse(storedLessons) : { lessons: [] };

    const lessonIndex = lessons.lessons.findIndex((l) => l.id === lesson.id);
    if (lessonIndex !== -1) {
      lessons.lessons[lessonIndex] = {
        ...lessons.lessons[lessonIndex],
        ...lesson,
      };

      localStorage.setItem("lessons", JSON.stringify(lessons));
      return lessons.lessons[lessonIndex];
    } else {
      throw new Error("Lesson not found");
    }
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
};
