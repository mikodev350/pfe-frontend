import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import db from "../database/database";
import { uploadFile } from "./apiUpload";

// Convert a file to base64 format
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Add or update a file in IndexedDB
export const addOrUpdateFileInIndexedDB = async (file) => {
  console.log("file-----------------------------------------------------");
  alert(JSON.stringify(file));
  console.log(file);

  const existingFile = await db.files.get(file.id);

  if (!existingFile) {
    await db.files.put({
      id: file.id,
      name: file.file.name,
      type: file.file.type,
      content: await fileToBase64(file.file),
      createdAt: file.createdAt
    });
  } else {
    await db.files.update(file.id, {
      name: file.file.name,
      type: file.file.type,
      content: await fileToBase64(file.file),
      createdAt: file.createdAt
    });
  }
};
/************************************************************************************************/
// Add or update a file in IndexedDB
export const addFileInToIndexedDB = async (url,file) => {
  console.log("file-----------------------------------------------------");
  const data = await db.files.add({
      name: file.name,
      type: file.type,
      url: url, // Store the URL of the file from Strapi
      createdAt: new Date(), 
    });
     
    return data;
  // //  const fileUrl = file.url ? file.url : file.preview; 
  // const existingFile = await db.files.get(file.id);
  // if (!existingFile) {
  //           console.log("I AM HEREEEEE");

  //   const newId = await db.files.add({
  //     name: file.name,
  //     type: file.type,
  //     url: url, // Store the URL of the file from Strapi
  //     createdAt: file.createdAt
  //   });
  //       console.log("New file added with ID:", newId);

  // } else {
  //   await db.files.update(file.id, {
  //     name: file.name,
  //     type: file.type,
  //     url: url, // Store the URL of the file from Strapi
  //     createdAt: file.createdAt
  //   });
  // }


  // const existingFile = await db.files.get(file.id);

  // if (!existingFile) {
  //   await db.files.put({
  //     id: file.id,
  //     name: file.file.name,
  //     type: file.file.type,
  //     content: await fileToBase64(file.file),
  //     createdAt: file.createdAt
  //   });
  // } else {
  //   await db.files.update(file.id, {
  //     name: file.file.name,
  //     type: file.file.type,
  //     content: await fileToBase64(file.file),
  //     createdAt: file.createdAt
  //   });
  // }
};
/************************************************************************************************/  

// Function to save a file to IndexedDB
export const saveFileToIndexedDB = async (file) => {
    console.log("saveFileToIndexedDB-----------------------------------------------------");
  console.log(file)

  try {
    const id = await db.files.add({
      name: file.raw.name,
      type: file.raw.type,
      preview: file.preview,
      content: file,
      createdAt: new Date().toISOString(),
    });

    return id;
  } catch (error) {
    console.error("Error saving file to IndexedDB:", error);
    throw error;
  }
};

// Handle data conflicts between IndexedDB and the server
const handleConflict = (localData, remoteData) => {
  return new Date(localData.updatedAt) > new Date(remoteData.updatedAt) ? localData : remoteData;
};

// Add or update a resource in IndexedDB
const addOrUpdateResourceInIndexedDB = async (resource) => {
  const existingResource = await db.resources.get(resource.id);
  if (!existingResource) {
    await db.resources.put(resource);
  } else {
    await db.resources.update(resource.id, resource);
  }
};

// Function to fetch resources
export const fetchResources = async (page, pageSize, sectionId, searchValue, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources`, {
      params: {
        page,
        pageSize,
        _q: searchValue,
        section: sectionId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await db.transaction("rw", db.resources, async () => {
      for (const resource of response.data.data) {
        await addOrUpdateResourceInIndexedDB(resource);
      }
    });

    return {
      data: response.data.data,
      totalPages: Math.ceil(response.data.total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching resources:", error);

    const localData = await db.resources
      .filter((resource) => resource.nom.includes(searchValue))
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalLocalDataCount = await db.resources
      .filter((resource) => resource.nom.includes(searchValue))
      .count();

    return {
      data: localData,
      totalPages: Math.ceil(totalLocalDataCount / pageSize),
    };
  }
};

// Function to save a resource
export const saveResource = async (resourceData, token) => {
  let newData = {
    ...resourceData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

    console.log("newData");

  console.log(newData);


  if (!navigator.onLine) {
    try {
      const userId = localStorage.getItem("userId");

      await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
        const id = await db.resources.add(newData);
        await db.offlineChanges.add({
          type: "add",
          data: {
            userId: userId,
            ...newData,
          },
          timestamp: Date.now(),
        });
      });
      return { status: "offline", data: newData };
    } catch (error) {
      console.error("Error adding data to IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const userId = localStorage.getItem("userId");

      newData = {
        userId: userId,
        ...newData,
      };
      const response = await axios.post(`${API_BASE_URL}/resources`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await db.transaction("rw", [db.resources], async () => {
        await db.resources.add({ id: response.data.data.id, ...newData });
      });

      return { status: "success", data: response.data.data };
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
      } else {
        console.error("Error creating resource:", error.message);
      }
      throw error;
    }
  }
};

// Function to update a resource
export const updateResource = async (id, data, token) => {
  const updatedData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (!navigator.onLine) {
    try {
      await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
        const existingResource = await db.resources.get(Number(id));
        if (existingResource) {
          await db.resources.update(Number(existingResource.id), {
            ...existingResource,
            ...updatedData,
          });

          await db.offlineChanges.add({
            type: "update",
            data: { id, ...updatedData },
            timestamp: Date.now(),
            endpoint: `${API_BASE_URL}/resources/${id}`,
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } else {
          console.error("Resource not found in IndexedDB for update:", id);
        }
      });

      return { status: "offline", data: updatedData };
    } catch (error) {
      console.error("Error updating data in IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const userId = localStorage.getItem("userId");
      const newData = {
        userId: userId,
        ...updatedData,
      };

      // Handle file uploads
      const { images, audio, pdf, video, ...resourceData } = newData;

      // Upload new images
      const uploadedImages = [];
      for (let image of images) {
        if (image.raw) {
          const uploadedImage = await uploadFile(image.raw, token);
          uploadedImages.push(uploadedImage[0]);
        } else {
          uploadedImages.push(image);
        }
      }
      resourceData.images = uploadedImages;

      if (audio && audio.raw) {
        const uploadedAudio = await uploadFile(audio.raw, token);
        resourceData.audio = uploadedAudio[0];
      } else if (audio && audio.id) {
        resourceData.audio = { id: audio.id, url: audio.preview };
      }

      if (pdf && pdf.raw) {
        const uploadedPdf = await uploadFile(pdf.raw, token);
        resourceData.pdf = uploadedPdf[0];
      } else if (pdf && pdf.id) {
        resourceData.pdf = { id: pdf.id, url: pdf.preview };
      }

      if (video && video.raw) {
        const uploadedVideo = await uploadFile(video.raw, token);
        resourceData.video = uploadedVideo[0];
      } else if (video && video.id) {
        resourceData.video = { id: video.id, url: video.preview };
      }

      const response = await axios.put(`${API_BASE_URL}/resources/${id}`, resourceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await db.transaction("rw", [db.resources], async () => {
        const existingResource = await db.resources.get(Number(id));
        if (existingResource) {
          await db.resources.update(Number(id), resourceData);
        } else {
          console.error("Resource not found in IndexedDB for update:", id);
        }
      });

      return { status: "success", data: response.data };
    } catch (error) {
      console.error("Error updating resource:", error);
      throw error;
    }
  }
};

// Function to delete a resource
export const deleteResource = async (id, token) => {
  if (!navigator.onLine) {
    try {
      await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
        const existingResource = await db.resources.get(Number(id));
        if (existingResource) {
          await db.resources.delete(Number(id));

          await db.offlineChanges.add({
            type: "delete",
            data: { id },
            timestamp: Date.now(),
            endpoint: `${API_BASE_URL}/resources/${id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } else {
          console.error("Resource not found in IndexedDB for delete:", id);
        }
      });

      return { status: "offline", data: { id } };
    } catch (error) {
      console.error("Error deleting data in IndexedDB:", error);
      throw error;
    }
  } else {
    try {
      const response = await axios.delete(`${API_BASE_URL}/resources/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await db.transaction("rw", [db.resources], async () => {
        const existingResource = await db.resources.get(Number(id));
        if (existingResource) {
          await db.resources.delete(Number(id));
        } else {
          console.error("Resource not found in IndexedDB for delete:", id);
        }
      });

      return { status: "success", data: response.data };
    } catch (error) {
      console.error("Error deleting resource:", error);
      throw error;
    }
  }
};

// Function to generate a resource link
export const generateResourceLink = async (id, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources-link/${id}/generate-link`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error generating resource link:", error);
    throw error;
  }
};

// Function to get a resource by ID
export const getResourceById = async (id, token) => {
  try {
    if (!navigator.onLine) {
      const resource = await db.resources.get(Number(id));
      if (resource) {
        return resource;
      } else {
        throw new Error("Resource not found in IndexedDB");
      }
    }

    const response = await axios.get(`${API_BASE_URL}/resources/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    throw error;
  }
};

// Function to get a resource by token
export const getResourceByToken = async (resourceToken, tokenUser) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources-link/access/${resourceToken}`, {
      headers: {
        Authorization: `Bearer ${tokenUser}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching resource by token:", error);
    throw error;
  }
};

// Function to clone a resource
export const cloneResource = async (id, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resources-copy/clone/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error cloning resource:", error);
    throw error;
  }
};



/************************************************************************************************************/
// Convertir un fichier Blob en format base64
// const blobToBase64 = (blob) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(blob);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// };

// Fonction pour récupérer le Blob à partir de l'URL Blob locale
const getBlobFromUrl = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch the Blob from the URL');
  }
  return await response.blob();
};

// Fonction pour convertir le Blob en fichier
const blobToFile = (blob, name, type) => {
  return new File([blob], name, { type });
};

// Fonction pour préparer les données pour l'upload
const prepareDataForUpload = async (fileFromDB) => {
  try {
    const { url, name, type } = fileFromDB;
    const blob = await getBlobFromUrl(url);
    const file = blobToFile(blob, name, type);
    return file;
  } catch (error) {
    console.error('Erreur lors de la préparation des données pour l\'upload:', error);
    throw error;
  }
};

// Fonction pour uploader un fichier vers Strapi
const uploadFileToStrapi = async (file, token) => {
  const formData = new FormData();
  formData.append('files', file);

  // Log the FormData content for debugging
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  try {
    const response = await axios.post('http://localhost:1337/api/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Erreur lors de l\'upload du fichier vers Strapi:', error.response.data);
    } else {
      console.error('Erreur lors de l\'upload du fichier vers Strapi:', error.message);
    }
    throw error;
  }
};
/*************************************************************************************************************/  
// Function to sync offline changes
export const syncOfflineChangesResource = async (token, queryClient) => {
  const offlineChanges = await db.offlineChanges.toArray();
       const userId = localStorage.getItem("userId");

  for (const change of offlineChanges) {
    try {
      // if (change.type === "add") {
      //   const { images, audio, pdf, video, ...resourceData } = change.data;

      //   // Upload files
      //   const uploadedImages = [];
      //   for (let image of images) {
      //     const fileFromDB = await db.files.get(image.id);

      //     // if (fileFromDB) {
      //     //   // const file = blobToFile(blob, name, type);
      //     //   // const formData = new FormData();
      //     //   // formData.append('files', file);

            
      //     //   const uploadedImage = await uploadFile(image.content.raw, token);
      //     //   uploadedImages.push(uploadedImage[0]);
      //     // }

      //      if (fileFromDB) {
      //       const file = await prepareDataForUpload(fileFromDB);
      //       const uploadedImage = await uploadFileToStrapi(file, token);
      //       uploadedImages.push(uploadedImage[0]);
      //     }
      //   }
      //   resourceData.images = uploadedImages;

      //   if (audio) {
      //     const fileFromDB = await db.files.get(audio.id);
      //     if (fileFromDB) {
      //       const uploadedAudio = await uploadFile(fileFromDB.content.raw, token);
      //       resourceData.audio = uploadedAudio[0];
      //     }
      //   }

      //   if (pdf) {
      //     const fileFromDB = await db.files.get(pdf.id);
      //     if (fileFromDB) {
      //       const uploadedPdf = await uploadFile(fileFromDB.content.raw, token);
      //       resourceData.pdf = uploadedPdf[0];
      //     }
      //   }

      //   if (video) {
      //     const fileFromDB = await db.files.get(video.id);
      //     if (fileFromDB) {
      //       const uploadedVideo = await uploadFile(fileFromDB.content.raw, token);
      //       resourceData.video = uploadedVideo[0];
      //     }
      //   }

      //   const response = await axios.post(`${API_BASE_URL}/resources`, resourceData, {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });

      //   await db.transaction("rw", [db.resources], async () => {
      //     await db.resources.put(response.data.data);
      //   });

      //   queryClient.setQueryData(["resources"], (oldData) => {
      //     return {
      //       ...oldData,
      //       data: [...oldData.data, response.data.data],
      //     };
      //   });

      // } 
           if (change.type === "add") {
        const { images, audio, pdf, video, ...resourceData } = change.data;

        // Upload images
        const uploadedImages = [];
        for (let image of images) {
          const fileFromDB = await db.files.get(image.id);
          if (fileFromDB) {
            const file = await prepareDataForUpload(fileFromDB);
            const uploadedImage = await uploadFileToStrapi(file, token);
            uploadedImages.push(uploadedImage[0]);
          }
        }
        resourceData.images = uploadedImages;

        // Upload audio
        if (audio) {
          const fileFromDB = await db.files.get(audio.id);
          if (fileFromDB) {
            const file = await prepareDataForUpload(fileFromDB);
            const uploadedAudio = await uploadFileToStrapi(file, token);
            resourceData.audio = uploadedAudio[0];
          }
        }

        // Upload PDF
        if (pdf) {
          const fileFromDB = await db.files.get(pdf.id);
          if (fileFromDB) {
            const file = await prepareDataForUpload(fileFromDB);
            const uploadedPdf = await uploadFileToStrapi(file, token);
            resourceData.pdf = uploadedPdf[0];
          }
        }

        // Upload video
        if (video) {
          const fileFromDB = await db.files.get(video.id);
          if (fileFromDB) {
            const file = await prepareDataForUpload(fileFromDB);
            const uploadedVideo = await uploadFileToStrapi(file, token);
            resourceData.video = uploadedVideo[0];
          }
        }

        const response = await axios.post(`${API_BASE_URL}/resources`, resourceData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await db.transaction("rw", [db.resources], async () => {
          await db.resources.put(response.data.data);
        });

        queryClient.setQueryData(["resources"], (oldData) => {
          return {
            ...oldData,
            data: [...oldData.data, response.data.data],
          };
        });

      } 
      else if (change.type === "update") {
        const { images, audio, pdf, video, ...resourceData } = change.data;


        const remoteData = await axios
          .get(`${API_BASE_URL}/resources/${resourceData.id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => response.data);

        const resolvedData = handleConflict(resourceData, remoteData);

        // Upload images
        const uploadedImages = [];
        for (let image of images) {
          const fileFromDB = await db.files.get(image.id);
          if (fileFromDB) {
            const file = await prepareDataForUpload(fileFromDB);
            const uploadedImage = await uploadFileToStrapi(file, token);
            uploadedImages.push(uploadedImage[0]);
          }
        }
        resolvedData.images = uploadedImages;

        // Upload audio
        if (audio) {
          const fileFromDB = await db.files.get(audio.id);
          if (fileFromDB) {
            const file = await prepareDataForUpload(fileFromDB);
            const uploadedAudio = await uploadFileToStrapi(file, token);
            resolvedData.audio = uploadedAudio[0];
          }
        }

        // Upload PDF
        if (pdf) {
          const fileFromDB = await db.files.get(pdf.id);
          if (fileFromDB) {
            const file = await prepareDataForUpload(fileFromDB);
            const uploadedPdf = await uploadFileToStrapi(file, token);
            resolvedData.pdf = uploadedPdf[0];
          }
        }

        // Upload video
        if (video) {
          const fileFromDB = await db.files.get(video.id);
          if (fileFromDB) {
            const file = await prepareDataForUpload(fileFromDB);
            const uploadedVideo = await uploadFileToStrapi(file, token);
            resolvedData.video = uploadedVideo[0];
          }
        }
        console.log("resolvedData");
                console.log(resolvedData);


                const dataPush=
                {...resolvedData,
                  userId:userId
                }
        const response = await axios.put(`${API_BASE_URL}/resources/${resolvedData.id}`, dataPush, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await db.transaction("rw", [db.resources], async () => {
          const existingResource = await db.resources.get(Number(resolvedData.id));
          if (existingResource) {
            await db.resources.update(resolvedData.id, resolvedData);
          } else {
            console.error("Resource not found in IndexedDB for update after sync:", resolvedData.id);
          }
        });

        queryClient.setQueryData(["resources"], (oldData) => {
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === resolvedData.id ? resolvedData : item
            ),
          };
        });
      }  else if (change.type === "delete") {
        await axios.delete(`${API_BASE_URL}/resources/${change.data.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await db.transaction("rw", [db.resources], async () => {
          const existingResource = await db.resources.get(Number(change.data.id));
          if (existingResource) {
            await db.resources.delete(Number(change.data.id));
          } else {
            console.error("Resource not found in IndexedDB for delete after sync:", change.data.id);
          }
        });

        queryClient.setQueryData(["resources"], (oldData) => {
          return {
            ...oldData,
            data: oldData.data.filter((item) => item.id !== change.data.id),
          };
        });
      }
    } catch (error) {
      console.error("Error syncing change:", change, error);
    }
  }
  await db.offlineChanges.clear();
};














// import axios from "axios";
// import { API_BASE_URL } from "../constants/constante";
// import db from "../database/database";
// import { uploadFile } from "./apiUpload";



// // Convert a file to base64 format
// const fileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// };

// // Add or update a file in IndexedDB
// const addOrUpdateFileInIndexedDB = async (file) => {
//   const existingFile = await db.files.get(file.id);

//   if (!existingFile) {
//     await db.files.put({
//       id: file.id,
//       name: file.file.name,
//       type: file.file.type,
//       content: await fileToBase64(file.file),
//       createdAt: file.createdAt
//     });
//   } else {
//     await db.files.update(file.id, {
//       name: file.file.name,
//       type: file.file.type,
//       content: await fileToBase64(file.file),
//       createdAt: file.createdAt
//     });
//   }
// };

// // Function to save a file to IndexedDB
// export const saveFileToIndexedDB = async (file) => {
  
//   try {
//     const id = await db.files.add({
//       name: file.raw.name,
//       type: file.raw.type,
//       preview:file.preview,
//       content: file,
//       createdAt: new Date().toISOString(),
//     });

//     return id;
//   } catch (error) {
//     console.error("Error saving file to IndexedDB:", error);
//     throw error;
//   }
// };
// // // Convert a file to base64 format
// // const fileToBase64 = (file) => {
// //   return new Promise((resolve, reject) => {
// //     const reader = new FileReader();
// //     reader.readAsDataURL(file);
// //     reader.onload = () => resolve(reader.result);
// //     reader.onerror = (error) => reject(error);
// //   });
// // };

// // // Add or update a file in IndexedDB
// // const addOrUpdateFileInIndexedDB = async (file) => {
// //   const existingFile = await db.files.get(file.id);

// //   if (!existingFile) {
// //     await db.files.put({
// //       id: file.id,
// //       name: file.file.name,
// //       type: file.file.type,
// //       content: await fileToBase64(file.file),
// //       createdAt: file.createdAt
// //     });
// //   } else {
// //     await db.files.update(file.id, {
// //       name: file.file.name,
// //       type: file.file.type,
// //       content: await fileToBase64(file.file),
// //       createdAt: file.createdAt
// //     });
// //   }
// // };

// // // Function to save a file to IndexedDB
// // export const saveFileToIndexedDB = async (file) => {
// //   try {
// //     console.log('====================================');
// //     console.log('====================================');
// //     console.log("file");
// //     console.log('====================================');
// //     console.log(file.raw.name);
// //     console.log(file.preview);
// //     console.log(file.raw.type);
// //     console.log("this is all the file");
// //     console.log(file);

    
// //     console.log('====================================');
// //     const id = await db.files.add({
// //      name : file.raw.name,
// //       preview: file.preview,
// //       type:file.raw.type,
// //       content:file,
// //       createdAt: new Date().toISOString(),
// //     });

// //     return id;
// //   } catch (error) {
// //     console.error("Error saving file to IndexedDB:", error);
// //     throw error;
// //   }
// // };

// // Handle data conflicts between IndexedDB and the server
// const handleConflict = (localData, remoteData) => {
//   return new Date(localData.updatedAt) > new Date(remoteData.updatedAt) ? localData : remoteData;
// };

// // Add or update a resource in IndexedDB
// const addOrUpdateResourceInIndexedDB = async (resource) => {
//   const existingResource = await db.resources.get(resource.id);
//   if (!existingResource) {
//     await db.resources.put(resource);
//   } else {
//     await db.resources.update(resource.id, resource);
//   }
// };

// // Function to fetch resources
// export const fetchResources = async (page, pageSize, sectionId, searchValue, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/resources`, {
//       params: {
//         page,
//         pageSize,
//         _q: searchValue,
//         section: sectionId,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     await db.transaction("rw", db.resources, async () => {
//       for (const resource of response.data.data) {
//         await addOrUpdateResourceInIndexedDB(resource);
//       }
//     });

//     return {
//       data: response.data.data,
//       totalPages: Math.ceil(response.data.total / pageSize),
//     };
//   } catch (error) {
//     console.error("Error fetching resources:", error);

//     const localData = await db.resources
//       .filter((resource) => resource.nom.includes(searchValue))
//       .offset((page - 1) * pageSize)
//       .limit(pageSize)
//       .toArray();

//     const totalLocalDataCount = await db.resources
//       .filter((resource) => resource.nom.includes(searchValue))
//       .count();

//     return {
//       data: localData,
//       totalPages: Math.ceil(totalLocalDataCount / pageSize),
//     };
//   }
// };

// // Function to save a resource
// export const saveResource = async (resourceData, token) => {
//   let newData = {
//     ...resourceData,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   };

//   alert(JSON.stringify(resourceData))
//   console.log("Creating resource:", newData);

//   if (!navigator.onLine) {
//     // Handle offline case
//     try {
//       const userId = localStorage.getItem("userId");

//       await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
//         const id = await db.resources.add(newData);
//         await db.offlineChanges.add({
//           type: "add",
//           data: {         
//             userId: userId,
//             ...newData,
//           },
//           timestamp: Date.now(),
//         });
//         console.log("Offline create added to offlineChanges:", newData);
//       });
//       return { status: "offline", data: newData };
//     } catch (error) {
//       console.error("Error adding data to IndexedDB:", error);
//       throw error;
//     }
//   } else {
//     // Handle online case
//     try {
//       const userId = localStorage.getItem("userId");

//       newData = {
//         userId: userId,
//         ...newData,
//       };
//       const response = await axios.post(`${API_BASE_URL}/resources`, newData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log("Server response:", response.data);

//       await db.transaction("rw", [db.resources], async () => {
//         await db.resources.add({ id: response.data.data.id, ...newData });
//       });

//       console.log("Resource created online and added to IndexedDB:", response.data.data);
//       return { status: "success", data: response.data.data };
//     } catch (error) {
//       if (error.response) {
//         console.error("Server responded with error:", error.response.data);
//       } else {
//         console.error("Error creating resource:", error.message);
//       }
//       throw error;
//     }
//   }
// };



// export const updateResource = async (id, data, token) => {
//   const updatedData = {
//     ...data,
//     updatedAt: new Date().toISOString(),
//   };

//   if (!navigator.onLine) {
//     try {
//       await db.transaction('rw', [db.resources, db.offlineChanges], async () => {
//         const existingResource = await db.resources.get(Number(id));
//         if (existingResource) {
//           console.log('Existing resource found in IndexedDB:', existingResource);
//           await db.resources.update(Number(existingResource.id), {
//             ...existingResource,
//             ...updatedData,
//           });
//           console.log('Resource updated in IndexedDB:', updatedData);

//           await db.offlineChanges.add({
//             type: 'update',
//             data: { id, ...updatedData },
//             timestamp: Date.now(),
//             endpoint: `${API_BASE_URL}/resources/${id}`,
//             method: 'PUT',
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           });
//           console.log('Offline update added to offlineChanges:', updatedData);
//         } else {
//           console.error('Resource not found in IndexedDB for update:', id);
//         }
//       });

//       return { status: 'offline', data: updatedData };
//     } catch (error) {
//       console.error('Error updating data in IndexedDB:', error);
//       throw error;
//     }
//   } else {
//     try {
//       const userId = localStorage.getItem('userId');
//       const newData = {
//         userId: userId,
//         ...updatedData,
//       };

//       // Handle file uploads
//       const { images, audio, pdf, video, ...resourceData } = newData;

//       // Upload new images
//       const uploadedImages = [];
//       for (let image of images) {
//         if (image.raw) {
//           const uploadedImage = await uploadFile(image.raw, token);
//           uploadedImages.push(uploadedImage[0]);
//         } else {
//           uploadedImages.push(image);
//         }
//       }
//       resourceData.images = uploadedImages;

//       if (audio && audio.raw) {
//         const uploadedAudio = await uploadFile(audio.raw, token);
//         resourceData.audio = uploadedAudio[0];
//       } else if (audio && audio.id) {
//         resourceData.audio = { id: audio.id, url: audio.preview };
//       }

//       if (pdf && pdf.raw) {
//         const uploadedPdf = await uploadFile(pdf.raw, token);
//         resourceData.pdf = uploadedPdf[0];
//       } else if (pdf && pdf.id) {
//         resourceData.pdf = { id: pdf.id, url: pdf.preview };
//       }

//       if (video && video.raw) {
//         const uploadedVideo = await uploadFile(video.raw, token);
//         resourceData.video = uploadedVideo[0];
//       } else if (video && video.id) {
//         resourceData.video = { id: video.id, url: video.preview };
//       }

//       const response = await axios.put(`${API_BASE_URL}/resources/${id}`, resourceData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       await db.transaction('rw', [db.resources], async () => {
//         const existingResource = await db.resources.get(Number(id));
//         if (existingResource) {
//           console.log('Existing resource found in IndexedDB for online update:', existingResource);
//           await db.resources.update(Number(id), resourceData);
//           console.log('Resource updated in IndexedDB after online update:', resourceData);
//         } else {
//           console.error('Resource not found in IndexedDB for update:', id);
//         }
//       });

//       console.log('Resource updated online:', response.data);
//       return { status: 'success', data: response.data };
//     } catch (error) {
//       console.error('Error updating resource:', error);
//       throw error;
//     }
//   }
// };

// // export const updateResource = async (id, data, token) => {
// //   const updatedData = {
// //     ...data,
// //     updatedAt: new Date().toISOString(),
// //   };

// //   if (!navigator.onLine) {
// //     try {
// //       await db.transaction('rw', [db.resources, db.offlineChanges], async () => {
// //         const existingResource = await db.resources.get(Number(id));
// //         if (existingResource) {
// //           console.log('Existing resource found in IndexedDB:', existingResource);
// //           await db.resources.update(Number(existingResource.id), {
// //             ...existingResource,
// //             ...updatedData,
// //           });
// //           console.log('Resource updated in IndexedDB:', updatedData);

// //           await db.offlineChanges.add({
// //             type: 'update',
// //             data: { id, ...updatedData },
// //             timestamp: Date.now(),
// //             endpoint: `${API_BASE_URL}/resources/${id}`,
// //             method: 'PUT',
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //               'Content-Type': 'application/json',
// //             },
// //           });
// //           console.log('Offline update added to offlineChanges:', updatedData);
// //         } else {
// //           console.error('Resource not found in IndexedDB for update:', id);
// //         }
// //       });

// //       return { status: 'offline', data: updatedData };
// //     } catch (error) {
// //       console.error('Error updating data in IndexedDB:', error);
// //       throw error;
// //     }
// //   } else {
// //     try {
// //       const userId = localStorage.getItem('userId');
// //       const newData = {
// //         userId: userId,
// //         ...updatedData,
// //       };

// //       const response = await axios.put(`${API_BASE_URL}/resources/${id}`, newData, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       await db.transaction('rw', [db.resources], async () => {
// //         const existingResource = await db.resources.get(Number(id));
// //         if (existingResource) {
// //           console.log('Existing resource found in IndexedDB for online update:', existingResource);
// //           await db.resources.update(Number(id), newData);
// //           console.log('Resource updated in IndexedDB after online update:', newData);
// //         } else {
// //           console.error('Resource not found in IndexedDB for update:', id);
// //         }
// //       });

// //       console.log('Resource updated online:', response.data);
// //       return { status: 'success', data: response.data };
// //     } catch (error) {
// //       console.error('Error updating resource:', error);
// //       throw error;
// //     }
// //   }
// // };
// // // Function to update a resource
// // export const updateResource = async (id, data, token) => {
// //   const updatedData = {
// //     ...data,
// //     updatedAt: new Date().toISOString(),
// //   };

// //   if (!navigator.onLine) {
// //     try {
// //       await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
// //         const existingResource = await db.resources.get(Number(id));
// //         if (existingResource) {
// //           console.log("Existing resource found in IndexedDB:", existingResource);
// //           await db.resources.update(Number(existingResource.id), {
// //             ...existingResource,
// //             ...updatedData,
// //           });
// //           console.log("Resource updated in IndexedDB:", updatedData);

// //           await db.offlineChanges.add({
// //             type: "update",
// //             data: { id, ...updatedData },
// //             timestamp: Date.now(),
// //             endpoint: `${API_BASE_URL}/resources/${id}`,
// //             method: "PUT",
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //               'Content-Type': 'application/json',
// //             },
// //           });
// //           console.log("Offline update added to offlineChanges:", updatedData);
// //         } else {
// //           console.error("Resource not found in IndexedDB for update:", id);
// //         }
// //       });

// //       return { status: "offline", data: updatedData };
// //     } catch (error) {
// //       console.error("Error updating data in IndexedDB:", error);
// //       throw error;
// //     }
// //   } else {
// //     try {
// //       const userId = localStorage.getItem("userId");
// //       const newData = {
// //         userId: userId,
// //         ...updatedData,
// //       };

// //       // Upload files
// //       const { images, audio, pdf, video, ...resourceData } = newData;

// //       // Upload new images
// //       const uploadedImages = [];
// //       for (let image of images) {
// //         if (image.raw) {
// //           const uploadedImage = await uploadFile(image.raw, token);
// //           uploadedImages.push(uploadedImage[0]);
// //         } else {
// //           uploadedImages.push(image);
// //         }
// //       }
// //       resourceData.images = uploadedImages;

// //       if (audio && audio.raw) {
// //         const uploadedAudio = await uploadFile(audio.raw, token);
// //         resourceData.audio = uploadedAudio[0];
// //       }

// //       if (pdf && pdf.raw) {
// //         const uploadedPdf = await uploadFile(pdf.raw, token);
// //         resourceData.pdf = uploadedPdf[0];
// //       }

// //       if (video && video.raw) {
// //         const uploadedVideo = await uploadFile(video.raw, token);
// //         resourceData.video = uploadedVideo[0];
// //       }

// //       const response = await axios.put(`${API_BASE_URL}/resources/${id}`, resourceData, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       await db.transaction("rw", [db.resources], async () => {
// //         const existingResource = await db.resources.get(Number(id));
// //         if (existingResource) {
// //           console.log("Existing resource found in IndexedDB for online update:", existingResource);
// //           await db.resources.update(Number(id), resourceData);
// //           console.log("Resource updated in IndexedDB after online update:", resourceData);
// //         } else {
// //           console.error("Resource not found in IndexedDB for update:", id);
// //         }
// //       });

// //       console.log("Resource updated online:", response.data);
// //       return { status: "success", data: response.data };
// //     } catch (error) {
// //       console.error("Error updating resource:", error);
// //       throw error;
// //     }
// //   }
// // };

// // Function to delete a resource
// export const deleteResource = async (id, token) => {
//   if (!navigator.onLine) {
//     try {
//       await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
//         const existingResource = await db.resources.get(Number(id));
//         if (existingResource) {
//           console.log("Existing resource found in IndexedDB:", existingResource);
//           await db.resources.delete(Number(id));
//           console.log("Resource deleted in IndexedDB:", id);

//           await db.offlineChanges.add({
//             type: "delete",
//             data: { id },
//             timestamp: Date.now(),
//             endpoint: `${API_BASE_URL}/resources/${id}`,
//             method: "DELETE",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           });
//           console.log("Offline delete added to offlineChanges:", id);
//         } else {
//           console.error("Resource not found in IndexedDB for delete:", id);
//         }
//       });

//       return { status: "offline", data: { id } };
//     } catch (error) {
//       console.error("Error deleting data in IndexedDB:", error);
//       throw error;
//     }
//   } else {
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/resources/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       await db.transaction("rw", [db.resources], async () => {
//         const existingResource = await db.resources.get(Number(id));
//         if (existingResource) {
//           console.log("Existing resource found in IndexedDB for online delete:", existingResource);
//           await db.resources.delete(Number(id));
//           console.log("Resource deleted in IndexedDB after online delete:", id);
//         } else {
//           console.error("Resource not found in IndexedDB for delete:", id);
//         }
//       });

//       console.log("Resource deleted online:", response.data);
//       return { status: "success", data: response.data };
//     } catch (error) {
//       console.error("Error deleting resource:", error);
//       throw error;
//     }
//   }
// };

// // Function to generate a resource link
// export const generateResourceLink = async (id, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/resources-link/${id}/generate-link`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error generating resource link:", error);
//     throw error;
//   }
// };

// // Function to get a resource by ID
// export const getResourceById = async (id, token) => {
//   try {
//     if (!navigator.onLine) {
//       console.log("Offline: Fetching resource from IndexedDB");
//       const resource = await db.resources.get(Number(id));
//       if (resource) {
//         return resource;
//       } else {
//         throw new Error("Resource not found in IndexedDB");
//       }
//     }

//     console.log("Online: Fetching resource from API");
//     const response = await axios.get(`${API_BASE_URL}/resources/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching resource by ID:", error);
//     throw error;
//   }
// };

// // Function to get a resource by token
// export const getResourceByToken = async (resourceToken, tokenUser) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/resources-link/access/${resourceToken}`, {
//       headers: {
//         Authorization: `Bearer ${tokenUser}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching resource by token:", error);
//     throw error;
//   }
// };

// // Function to clone a resource
// export const cloneResource = async (id, token) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/resources-copy/clone/${id}`, {}, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error cloning resource:", error);
//     throw error;
//   }
// };


// // Function to sync offline changes
// export const syncOfflineChangesResource = async (token, queryClient) => {
//   const offlineChanges = await db.offlineChanges.toArray();
// let  dataResource;
//   for (const change of offlineChanges) {
//     try {
//       if (change.type === "add") {
//         const { images, audio, pdf, video, ...resourceData } = change.data;


//         // Upload files
//         const uploadedImages = [];
//         for (let image of images) {
//           console.log('Image before upload:', image);
//           const fileFromDB = await db.files.get(image.id);
//                     console.log('Image after upload:', fileFromDB);

//           if (fileFromDB) {
//             const uploadedImage = await uploadFile(fileFromDB.content.raw, token);
//             uploadedImages.push(uploadedImage[0]);
//           }
//         }

// dataResource={
//           ... resourceData
//           ,images: uploadedImages
//         }


//         if (audio) {
//           const fileFromDB = await db.files.get(audio.id);
//           if (fileFromDB) {
//             const uploadedAudio = await uploadFile(fileFromDB.content.raw, token);
//             resourceData.audio = uploadedAudio[0];
//           }
//         }

//         if (pdf) {
//           const fileFromDB = await db.files.get(pdf.id);
//           if (fileFromDB) {
//             const uploadedPdf = await uploadFile(fileFromDB.content.raw, token);
//             // resourceData.pdf = uploadedPdf[0];
// dataResource={
//           ... resourceData,
//           pdf: uploadedPdf
//         }           
//           }
           
//         }

//         if (video) {
//           const fileFromDB = await db.files.get(video.id);
//           if (fileFromDB) {
//             const uploadedVideo = await uploadFile(fileFromDB.content.raw, token);
//             // resourceData.video = uploadedVideo[0];
//              dataResource={
//           ... resourceData
//           ,video: uploadedVideo
//           }      
//         }
//         }

//         const response = await axios.post(`${API_BASE_URL}/resources`, dataResource, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         await db.transaction("rw", [db.resources], async () => {
//           await db.resources.put(response.data.data);
//         });

//         queryClient.setQueryData(["resources"], (oldData) => {
//           return {
//             ...oldData,
//             data: [...oldData.data, response.data.data],
//           };
//         });

//         console.log("Resource added and synced online:", response.data.data);
//       } else if (change.type === "update") {
//         const { images, audio, pdf, video, ...resourceData } = change.data;

//         const remoteData = await axios
//           .get(`${API_BASE_URL}/resources/${resourceData.id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((response) => response.data);

//         const resolvedData = handleConflict(resourceData, remoteData);

//         // Upload files
//         const uploadedImages = [];
//         for (let image of images) {
//           const fileFromDB = await db.files.get(image.id);
//           if (fileFromDB) {
//             const uploadedImage = await uploadFile(fileFromDB, token);
//             uploadedImages.push(uploadedImage[0]);
//           }
//         }
//         resolvedData.images = uploadedImages;

//         if (audio) {
//           const fileFromDB = await db.files.get(audio.id);
//           if (fileFromDB) {
//             const uploadedAudio = await uploadFile(fileFromDB.content.raw, token);
//             resolvedData.audio = uploadedAudio[0];
//           }
//         }

//         if (pdf) {
//           const fileFromDB = await db.files.get(pdf.id);
//           if (fileFromDB) {
//             const uploadedPdf = await uploadFile(fileFromDB.content.raw, token);
//             resolvedData.pdf = uploadedPdf[0];
//           }
//         }

//         if (video) {
//           const fileFromDB = await db.files.get(video.id);
//           if (fileFromDB) {
//             const uploadedVideo = await uploadFile(fileFromDB.content.raw, token);
//             resolvedData.video = uploadedVideo[0];
//           }
//         }

//         const response = await axios.put(`${API_BASE_URL}/resources/${resolvedData.id}`, resolvedData, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         await db.transaction("rw", [db.resources], async () => {
//           const existingResource = await db.resources.get(Number(resolvedData.id));
//           if (existingResource) {
//             await db.resources.update(resolvedData.id, resolvedData);
//             console.log("Resource updated in IndexedDB after sync:", resolvedData);
//           } else {
//             console.error("Resource not found in IndexedDB for update after sync:", resolvedData.id);
//           }
//         });

//         queryClient.setQueryData(["resources"], (oldData) => {
//           return {
//             ...oldData,
//             data: oldData.data.map((item) =>
//               item.id === resolvedData.id ? resolvedData : item
//             ),
//           };
//         });
//       } else if (change.type === "delete") {
//         await axios.delete(`${API_BASE_URL}/resources/${change.data.id}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         await db.transaction("rw", [db.resources], async () => {
//           const existingResource = await db.resources.get(Number(change.data.id));
//           if (existingResource) {
//             await db.resources.delete(Number(change.data.id));
//             console.log("Resource deleted in IndexedDB after sync:", change.data.id);
//           } else {
//             console.error("Resource not found in IndexedDB for delete after sync:", change.data.id);
//           }
//         });

//         queryClient.setQueryData(["resources"], (oldData) => {
//           return {
//             ...oldData,
//             data: oldData.data.filter((item) => item.id !== change.data.id),
//           };
//         });
//       }
//     } catch (error) {
//       console.error("Error syncing change:", change, error);
//     }
//   }
//   await db.offlineChanges.clear();
//   console.log("Offline changes cleared after sync");
// };
