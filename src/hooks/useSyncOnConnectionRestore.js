import { useEffect, useState, useRef } from "react";
import { syncAllOfflineChanges } from "./syncAllOfflineChanges";
import { getToken } from "../util/authUtils";

const useSyncOnConnectionRestore = (queryClient) => {
  const token = getToken();
  const [isSyncing, setIsSyncing] = useState(false);
  const syncQueue = useRef([]);

  const processQueue = async () => {
    if (isSyncing || syncQueue.current.length === 0) {
      return;
    }

    setIsSyncing(true);
    try {
      while (syncQueue.current.length > 0) {
        const syncFunction = syncQueue.current.shift();
        await syncFunction();
      }
      console.log("All offline changes synchronized successfully!");
    } catch (error) {
      console.error("Error during synchronization:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      console.log("Connection restored, syncing offline changes...");
      syncQueue.current.push(() => syncAllOfflineChanges(token, queryClient));
      processQueue();
    };

    if (navigator.onLine) {
      handleOnline();
    }

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [token, queryClient]);

  return { isSyncing };
};

export default useSyncOnConnectionRestore;
