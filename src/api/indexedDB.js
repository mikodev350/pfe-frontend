// src/util/indexedDB.js

export const saveFileToIndexedDB = async (file, fileType) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("resourceDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["files"], "readwrite");
      const objectStore = transaction.objectStore("files");
      const fileRecord = { file, fileType, date: new Date() };

      objectStore.add(fileRecord);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const getFilesFromIndexedDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("resourceDB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["files"], "readonly");
      const objectStore = transaction.objectStore("files");
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const clearIndexedDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("resourceDB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["files"], "readwrite");
      const objectStore = transaction.objectStore("files");
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};
