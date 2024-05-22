import modulesData from "./fakeData/fakeModules.json";

export const fetchModules = async (currentPage, token, name, idParcours) => {
  try {
    const idParcoursNumber = Number(idParcours); // Convert idParcours to a number
    const pageSize = 5; // Set the page size to 5 for pagination

    // Log the complete data before filtering
    console.log("Complete Data:", modulesData.modules);

    // Filter the data based on the name and idParcours
    const filteredData = modulesData.modules.filter((module) => {
      const nameMatch = module.name.includes(name);
      const idParcoursMatch = module.idParcours === idParcoursNumber;
      console.log(`Module Name: ${module.name}, Name Match: ${nameMatch}`);
      console.log(
        `Module idParcours: ${module.idParcours}, idParcours Match: ${idParcoursMatch}`
      );
      return nameMatch && idParcoursMatch;
    });

    console.log("Filtered Data Length:", filteredData.length);
    console.log("Filtered Data:", filteredData);

    // Calculate start and end indices for pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    console.log("Start Index:", startIndex);
    console.log("End Index:", endIndex);

    // Slice the filtered data to get the paginated data
    const paginatedData = filteredData.slice(startIndex, endIndex);

    console.log("Paginated Data Length:", paginatedData.length);
    console.log("Paginated Data:", paginatedData);

    // Return the paginated data and the total number of pages
    return {
      data: paginatedData,
      totalPages: Math.ceil(filteredData.length / pageSize),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateModule = async (id, data) => {
  try {
    // Find the module and update it
    const moduleIndex = modulesData.modules.findIndex(
      (module) => module.id === id
    );
    if (moduleIndex !== -1) {
      modulesData.modules[moduleIndex] = {
        ...modulesData.modules[moduleIndex],
        ...data,
      };
    }
    // Simulate response
    return modulesData.modules[moduleIndex];
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
};

export const addModule = (name, idParcours) => {
  try {
    const storedModules = localStorage.getItem("modules");
    let modules = storedModules ? JSON.parse(storedModules) : { modules: [] };

    const newId = modules.modules.length + 1;

    const newModule = {
      id: newId,
      name: name,
      totalresource: 0,
      createdAt: new Date().toISOString(),
      idParcours: idParcours,
    };

    modules.modules.push(newModule);

    localStorage.setItem("modules", JSON.stringify(modules));

    return modules;
  } catch (error) {
    console.error("Error adding module:", error);
    throw error;
  }
};

// export const updateModule = async (id, data) => {
//   try {
//     const storedModules = localStorage.getItem("modules");
//     let modules = storedModules ? JSON.parse(storedModules) : { modules: [] };

//     const moduleIndex = modules.modules.findIndex((module) => module.id === id);
//     if (moduleIndex !== -1) {
//       modules.modules[moduleIndex] = {
//         ...modules.modules[moduleIndex],
//         ...data,
//       };
//       localStorage.setItem("modules", JSON.stringify(modules));
//       return modules.modules[moduleIndex];
//     } else {
//       throw new Error("Module not found");
//     }
//   } catch (error) {
//     console.error("Error updating module:", error);
//     throw error;
//   }
// };

// import axios from "axios";

// const BASE_URL = "http://your-api-url.com";

// export const fetchModules = async (page, token, search) => {
//   const response = await axios.get(`${BASE_URL}/modules`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     params: {
//       page,
//       search,
//     },
//   });
//   return response.data;
// };

// export const addModule = async (name) => {
//   const response = await axios.post(`${BASE_URL}/modules`, { name });
//   return response.data;
// };

// export const updateModule = async (id, data) => {
//   const response = await axios.put(`${BASE_URL}/modules/${id}`, data);
//   return response.data;
// };
