import { useEffect } from "react";
import { syncOfflineChanges } from "../api/ApiParcour";
import { getToken } from "../util/authUtils";
import { syncOfflineChangesModule } from "../api/apiModule";
import { syncOfflineChangesLesson } from "../api/apiLesson";
import { syncOfflineChangesResource } from "../api/apiResource";

const useSyncOnConnectionRestore = () => {
  const token = getToken();

  useEffect(() => {
    const handleOnline = async () => {
      console.log("Connection restored, syncing offline changes...");
      alert("Connection restored, syncing offline changes...");
      // await syncOfflineChanges(token);
      // await syncOfflineChangesModule(token);
      // await syncOfflineChangesLesson(token);
      await syncOfflineChangesResource(token);
    };

    if (navigator.onLine) {
      handleOnline();
    }

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [token]);
};

export default useSyncOnConnectionRestore;
