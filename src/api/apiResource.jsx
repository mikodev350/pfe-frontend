import axios from "axios";
import { API_BASE_URL } from "../constants/constante";
import db from "../database/database";
import { uploadFile } from "./apiUpload";


function removeCircularReferences(obj, seen = new Set()) {
  if (obj && typeof obj === 'object') {
    if (seen.has(obj)) {
      // Remplacer les objets déjà vus par une chaîne ou un autre indicateur
      return '[Circular]';
    }
    seen.add(obj);
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = removeCircularReferences(obj[key], seen);
      }
    }
    seen.delete(obj);
  }
  return obj;
}

// Function to convert a URL to a Blob
const urlToBlob = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);
    console.log("this is blob url :");
    console.log(blob);

    return { urlBlob: blobUrl, typeBlob: blob.type };
  } catch (error) {
    console.error('Error converting URL to Blob:', error);
    throw error;
  }
};



/************************************************************************************************/
// Add or update a file in IndexedDB
export const addFileInToIndexedDB = async (url,file) => {
  // console.log("file-----------------------------------------------------");
  //     console.log(file);

  //   console.log("url-----------------------------------------------------");
  //   console.log(url);

  const data = await db.files.add({
      name: file.name,
      type: file.type,
      url: url, // Store the URL of the file from Strapi
      createdAt: new Date(), 
    });

     
    return data; 
  }/************************************************************************************************/  


// Fonction pour vérifier si un fichier existe déjà dans IndexedDB
const fileExistsInIndexedDB = async (name) => {
  try {
    console.log("Checking if file exists in IndexedDB:", name);
    const existingFile = await db.files.where('name').equals(name).first();
    console.log("Existing file:", existingFile);
    return existingFile ? existingFile.id : null;
  } catch (error) {
    if (error.name === 'NotFoundError') {
      console.warn("Object store 'files' not found, returning null.");
      return null;
    } else {
      console.error("Error checking file existence:", error);
      throw error;
    }
  }
};



/**************************************************************************************************/ 
// Function to save a file to IndexedDB
// Fonction pour sauvegarder un fichier dans IndexedDB
export const saveFileToIndexedDB = async (file) => {
  console.log("saveFileToIndexedDB-----------------------------------------------------");
  console.log(file);

  const existingFileId = await fileExistsInIndexedDB(file.raw.name);
  if (existingFileId) {
    console.log(`File ${file.raw.name} already exists in IndexedDB, skipping save.`);
    return existingFileId;
  }

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


// Fonction pour sauvegarder un fichier dans IndexedDB à partir d'une URL
export const saveFileToIndexedDBResource = async (url, name) => {
  const existingFileId = await fileExistsInIndexedDB(name);
    console.log(existingFileId);
    console.log("double  je suisss icici ");


  if (existingFileId) {
    console.log(`File ${name} already exists in IndexedDB, skipping save.`);
    return existingFileId;
  }

  const { urlBlob, typeBlob } = await urlToBlob(`http://localhost:1337${url}`);
  try {
    const id = await db.files.add({
      name: name,
      type: typeBlob,
      url: urlBlob,

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





// Function to save a resource
export const saveResource = async (resourceData, token) => {
  console.log("resourceData")
    console.log(resourceData)

  let newData = {
    ...resourceData,
    isLocal:true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

    console.log("newData");

  console.log(newData);


  if (!navigator.onLine) {
    try {
      const userId = localStorage.getItem("userId");
      console.log("---------------------------------newData ---------------------------------------------------");
      console.log(newData);
      console.log("--------------------------------------------------------------------------------------------------");




let parcoursData=[] 
let modulesData=[] 
let lessonsData=[] 

        for (let parcour of resourceData.parcours) {
          const localData = await db.parcours.get(parseInt(parcour));
parcoursData.push({
  id: localData.id,
    nom: localData.nom,
})
        }

        console.log("parcoursData");
                console.log(parcoursData);


            for (let modul of resourceData.modules) {
          const localData = await db.modules.get(parseInt(modul));
modulesData.push({
  id: localData.id,
    nom: localData.nom,
})
        }

        console.log("modules");
                console.log(modulesData);

                   for (let lecon of resourceData.lessons) {
          const localData = await db.lessons.get(parseInt(lecon));
lessonsData.push({
  id: localData.id,
    nom: localData.nom,
})
        }
            console.log("lesson");
                console.log(lessonsData);

      // Préparer les données de la ressource
     newData = {
      id: resourceData.id,
      nom: resourceData.nom,
      format: resourceData.format,
      parcours: parcoursData,
      modules: modulesData,
      lessons: lessonsData,
      note: resourceData.note,
      images: resourceData.images,
      audio: resourceData.audio,
      video: resourceData.video,
      pdf: resourceData.pdf,
      link: resourceData.link,
      referenceLivre: resourceData.referenceLivre,
      isLocalUpload:true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

        console.log("------------------------------------------------------------------------------");

    console.log("this is newData");
  console.log(newData);


        console.log("------------------------------------------------------------------------------");





















      await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
        const id = await db.resources.add(newData);
        await db.offlineChanges.add({
          type: "add",
          dataBase: "resource",
          data: {
            ...newData,
            userId: userId,

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


/*************************************************/ 
// Function to update a resource
export const updateResource = async (id, data, token) => {
 
  const updatedData = {
    ...data,
        isLocal:true,
    updatedAt: new Date().toISOString(),
  };

   console.log("-----------------data--------------------------------------");
    console.log(id);
  console.log(updatedData);
    console.log("-----------------------------------------------------------------");


  if (!navigator.onLine) {

let parcoursData=[] 
let modulesData=[] 
let lessonsData=[] 



        for (let parcour of updatedData.parcours) {
         const parcoursId = parcour.id ? parcour?.id :parcour
          const localData = await db.parcours.get(parseInt(parcoursId));

          console.log(localData);
          parcoursData.push({
             id: localData.id,
             nom: localData.nom,
            })
        }
        
        updatedData.parcours=parcoursData;

        for (let modul of updatedData.modules) {
          const localData = await db.modules.get(parseInt(modul));
          modulesData.push({
            id: localData.id,
            nom: localData.nom,
          })
        }

        updatedData.modules=modulesData;

        
         for (let lecon of updatedData.lessons) {
          const localData = await db.lessons.get(parseInt(lecon));

          lessonsData.push({
            id: localData.id,
            nom: localData.nom,
})
         }
        updatedData.lessons=lessonsData;
    try {

      console.log(updatedData);
      await db.transaction("rw", [db.resources, db.offlineChanges], async () => {
        const existingResource = await db.resources.get(Number(id));
console.log("----------------------------------------");
console.log("existingResource");
console.log(existingResource);
console.log("----------------------------------------");

        if (existingResource) {
         
          await db.resources.update(Number(existingResource.id), {
            // ...existingResource,
            updatedData,
          });

          await db.offlineChanges.add({
            type: "update",
            dataBase: "resource",
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



/********************************************************************************************/ 
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
            dataBase: "resource",
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


// apiResource.jsx
export const getResourceById = async (id, token) => {
  try {
    if (!navigator.onLine) {
      console.log("Offline: Fetching resource from IndexedDB");
      const resource = await db.resources.get(Number(id));
      if (resource) {
        if (resource.isLocalUpload){

let imagesLink = []
let audioLink ;

  for (let image of resource.images) {
    const fileFromDB = await db.files.get(image.id);
    if (fileFromDB) {
imagesLink.push(fileFromDB.url)
    }
  }
  // Upload audio
  if (resource.audio) {
    const fileFromDB = await db.files.get(resource.audio.id);
    if (fileFromDB) {
    audioLink=fileFromDB.url;
    }
  }
let pdfLink;
  // Upload PDF
  if (resource.pdf) {
    const fileFromDB = await db.files.get(resource.pdf.id);
    if (fileFromDB) {
   pdfLink=fileFromDB.url;
    }
  }
let videoLink;
  // Upload video
  if (resource.video) {
     const fileFromDB = await db.files.get(resource.video.id);
    if (fileFromDB) {
   videoLink=fileFromDB.url;
    }
  }

           const resourceDataItem ={

id: resource.id,
nom: resource.nom,
parcours: resource.parcours,
modules: resource.modules,
lessons: resource.lessons,
note:resource.note,
format:resource.format,
images:imagesLink,
video:videoLink,
pdf:pdfLink,
referenceLivre:resource.referenceLivre,
link:resource.link,
audio:audioLink,
isLocalUpload:true
           }

          //  console.log(resourceDataItem);
          return resourceDataItem
        }
        console.log("********************************************************************************************");
        console.log("this is resrouce ");
        console.log(resource);
                console.log("********************************************************************************************");

        return resource; // Resource already contains all necessary data
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


/***************************************************************************/ 
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
const syncAndCacheFile = async (fileId, token, fileType) => {
  try {
    const fileFromDB = await db.files.get(fileId);
    if (fileFromDB) {
      const file = await prepareDataForUpload(fileFromDB);
      const uploadedFile = await uploadFileToStrapi(file, token);
      
      // Mise à jour du fichier dans IndexedDB après l'upload
      await db.files.update(fileFromDB.id, {
        name: uploadedFile[0].name,
        url: uploadedFile[0].url,
        createdAt: new Date(),
      });
      
      // Mise en cache du fichier téléchargé
      await cacheFile(`http://localhost:1337${uploadedFile[0].url}`);
      
      return uploadedFile[0];
    }
  } catch (error) {
    console.error(`Error syncing and caching ${fileType}:`, error);
    throw error;
  }
  return null;
};





// Function to sync offline changes
export const syncOfflineChangesResource = async (token, queryClient,change) => {
  
       const userId = localStorage.getItem("userId");

       console.log(change)
    try {

  if (change.type === "add") {
        const { images, audio, pdf, video, ...resourceData } = change.data;

        let parcoursData = [];
        let modulesData = [];
        let lessonsData = [];

        for (let parcour of resourceData.parcours) {
          parcoursData.push(parcour.id);
        }
        resourceData.parcours = parcoursData;

        for (let module of resourceData.modules) {
          modulesData.push(module.id);
        }
        resourceData.modules = modulesData;

        for (let lesson of resourceData.lessons) {
          lessonsData.push(lesson.id);
        }
        resourceData.lessons = lessonsData;

        // Synchroniser et mettre en cache les fichiers
        resourceData.images = await Promise.all(images.map(image => syncAndCacheFile(image.id, token, 'image')));
        resourceData.audio = audio ? await syncAndCacheFile(audio.id, token, 'audio') : null;
        resourceData.pdf = pdf ? await syncAndCacheFile(pdf.id, token, 'pdf') : null;
        resourceData.video = video ? await syncAndCacheFile(video.id, token, 'video') : null;

        const response = await axios.post(`${API_BASE_URL}/resources`, resourceData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });


        console.log("resolvedData")

        console.log(response)


        await db.transaction("rw", [db.resources], async () => {
          await db.resources.put(response.data.data);
        });

        queryClient.setQueryData(["resources"], (oldData) => {
          return {
            ...oldData,
            data: [...oldData.data, response.data.data],
          };
        });
      } else if (change.type === "update") {
        const { images, audio, pdf, video, ...resourceData } = change.data;

        let parcoursData = [];
        let modulesData = [];
        let lessonsData = [];

        for (let parcour of resourceData.parcours) {
          parcoursData.push(parcour.id);
        }
        resourceData.parcours = parcoursData;

        for (let module of resourceData.modules) {
          modulesData.push(module.id);
        }
        resourceData.modules = modulesData;

        for (let lesson of resourceData.lessons) {
          lessonsData.push(lesson.id);
        }
        resourceData.lessons = lessonsData;

        const remoteData = await axios.get(`${API_BASE_URL}/resources/${resourceData.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then(response => response.data);

        const resolvedData = handleConflict(resourceData, remoteData);

        resolvedData.images = await Promise.all(images.map(image => syncAndCacheFile(image.id, token, 'image')));
        resolvedData.audio = audio ? await syncAndCacheFile(audio.id, token, 'audio') : null;
        resolvedData.pdf = pdf ? await syncAndCacheFile(pdf.id, token, 'pdf') : null;
        resolvedData.video = video ? await syncAndCacheFile(video.id, token, 'video') : null;

        const cleanDataPush = removeCircularReferences({
          ...resolvedData,
          userId
        });

        const response = await axios.put(`${API_BASE_URL}/resources/${resolvedData.id}`, cleanDataPush, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("resolvedData")

        console.log(resolvedData)
        if (response.data) {
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
        } else {
          console.error("No data returned from server.");
        }
      }
      /******************************************************************************************/ 
    else if (change.type === "update") {
  const { images, audio, pdf, video, ...resourceData } = change.data;



  

  let parcoursData=[]
  let modulesData=[]
  let lessonsData=[]





    // Problemm esttt icccc
   for (let parcour of resourceData.parcours) {
parcoursData.push(parcour.id)
        }

  
        resourceData.parcours=parcoursData
       
            for (let module of resourceData.modules) {
modulesData.push(module.id)
        }
            resourceData.modules = modulesData;
   
            console.log("resourceData.modules");
            console.log(resourceData.modules);
      for (let module of resourceData.modules) {
parcoursData.push(module.id)
        }
        resourceData.parcours=resourceData

          for (let lesson of resourceData.lessons) {
lessonsData.push(lesson.id)
        }
            resourceData.lessons = lessonsData;

/************************************************************/
/************************************************************/ 


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
      // Mise à jour du fichier dans IndexedDB après l'upload
      await db.files.update(fileFromDB.id, {
        name: uploadedImage[0].name,
        url: uploadedImage[0].url,
        createdAt: new Date(),
      });
      await cacheFile(`http://localhost:1337${uploadedImage[0].url}`);

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

      // Mise à jour du fichier dans IndexedDB après l'upload
      await db.files.update(fileFromDB.id, {
        name: uploadedAudio[0].name,
        url: uploadedAudio[0].url,
        createdAt: new Date(),
      });

            await cacheFile(`http://localhost:1337${uploadedAudio[0].url}`);

      resolvedData.audio = uploadedAudio[0];
    }
  }

  // Upload PDF
  if (pdf) {
    const fileFromDB = await db.files.get(pdf.id);
    if (fileFromDB) {
      const file = await prepareDataForUpload(fileFromDB);
      const uploadedPdf = await uploadFileToStrapi(file, token);

      // Mise à jour du fichier dans IndexedDB après l'upload
      await db.files.update(fileFromDB.id, {
        name: uploadedPdf[0].name,
        url: uploadedPdf[0].url,
        createdAt: new Date(),
      });
            await cacheFile(`http://localhost:1337${uploadedPdf[0].url}`);

      resolvedData.pdf = uploadedPdf[0];
    }
  }

  // Upload video
  if (video) {
    const fileFromDB = await db.files.get(video.id);
    if (fileFromDB) {
      const file = await prepareDataForUpload(fileFromDB);
      const uploadedVideo = await uploadFileToStrapi(file, token);

      // Mise à jour du fichier dans IndexedDB après l'upload
      await db.files.update(fileFromDB.id, {
        name: uploadedVideo[0].name,
        url: uploadedVideo[0].url,
        createdAt: new Date(),
      });
            await cacheFile(`http://localhost:1337${uploadedVideo[0].url}`);

      resolvedData.video = uploadedVideo[0];
    }
  }

  

                const dataPush=
                {
                  ...resolvedData,
                  userId:userId
                }

        try {
  // Supprimer les références circulaires
  const cleanDataPush = removeCircularReferences(dataPush);

  const response = await axios.put(`${API_BASE_URL}/resources/${resolvedData.id}`, cleanDataPush, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("response", response);

  // Assurez-vous que response.data est défini avant de l'utiliser
  if (response.data) {
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
  } else {
    console.error("No data returned from server.");
  }
} catch (error) {
  console.error("Error during axios.put:", error);
}
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
  
  // await db.offlineChanges.clear();
};




/*************************************************************************************************************************/
export const cacheFile = async (url) => {
  try {
    console.log(`Caching file from URL: ${url}`);
    const cache = await caches.open('resource-files');
    const response = await fetch(url);
    await cache.put(url, response.clone());
    console.log(`File cached: ${url}`);
    return url;
  } catch (error) {
    console.error(`Error caching file from URL ${url}:`, error);
    return null;
  }
};














const addOrUpdateResourceInIndexedDB = async (resource) => {
  try {
    console.log("Start handling resource:", resource);

    
    // Préparer les données de la ressource
    const resourceData = {
      id: resource.id,
      nom: resource.nom,
      format: resource.format,
      parcours: resource.parcours,
      modules: resource.modules,
      lessons: resource.lessons,
      note: resource.note,
      images: [],
      audio: null,
      video: null,
      pdf: null,
      link: resource.link,
      referenceLivre: resource.referenceLivre,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };

    // // Mise en cache des fichiers si nécessaire
    // if (resource.images && Array.isArray(resource.images)) {
    //   resourceData.images = await Promise.all(resource.images.map(async (image) => {
    //     return await cacheFile(`http://localhost:1337${image.url}`) || `http://localhost:1337${image.url}`;
    //   }));
    // }

    if (resource.images && Array.isArray(resource.images)) {
  resourceData.images = await Promise.all(resource.images.map(async (image) => {
    const cachedUrl = await cacheFile(`http://localhost:1337${image.url}`) || `http://localhost:1337${image.url}`;
    return { id: image.id, url: cachedUrl };
  }));
}
    if (resource.audio && resource.audio.url) {
      resourceData.audio = {
        id: resource.audio.id,
        url:await cacheFile(`http://localhost:1337${resource.audio.url}`)
      };
    }

    if (resource.video && resource.video.url) {
      resourceData.video ={
        id: resource.video.id,
        url:  await cacheFile(`http://localhost:1337${resource.video.url}`)
      }
    }

    if (resource.pdf && resource.pdf.url) {
      resourceData.pdf = {
        id: resource.pdf.id,
        url: await cacheFile(`http://localhost:1337${resource.pdf.url}`)
      }
    }

    // Stockage ou mise à jour de la ressource dans IndexedDB
    await db.transaction('rw', db.resources, async () => {
      const existingResource = await db.resources.get(resource.id);
      if (!existingResource) {
        await db.resources.put(resourceData);
        console.log(`Resource ${resource.id} added to IndexedDB.`);
      } else {
        await db.resources.update(resource.id, resourceData);
        console.log(`Resource ${resource.id} updated in IndexedDB.`);
      }
    });

    console.log("Transaction completed for resource:", resource.id);
  } catch (error) {
    console.error(`Error handling resource ${resource.id}:`, error);
  }
};

// Fonction pour récupérer les ressources et les stocker dans IndexedDB
export const fetchResources = async (page, pageSize, searchValue, token) => {
  try {
  
    const response = await axios.get(`${API_BASE_URL}/resources`, {
      params: {
        page,
        pageSize,
        _q: searchValue,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response)
    console.log("Fetched resources:", response.data.data);

    // await db.transaction("rw", db.resources, async () => {
      for (const resource of response.data.data) {
        await addOrUpdateResourceInIndexedDB(resource);
      }
    // });

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
