import { syncOfflineChanges } from "../api/ApiParcour";
import { syncOfflineChangesModule } from "../api/apiModule";
import { syncOfflineChangesLesson } from "../api/apiLesson";
import { syncOfflineChangesResource } from "../api/apiResource";
import db from "../database/database";

export const syncAllOfflineChanges = async (token, queryClient) => {
  const offlineChanges = await db.offlineChanges.toArray();

  // Fonction pour introduire un délai
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // Trier les changements par timestamp pour assurer l'ordre correct
  offlineChanges.sort((a, b) => a.timestamp - b.timestamp);

  for (const change of offlineChanges) {
    try {
      if (change.dataBase === "parcour") {
        await syncOfflineChanges(token, queryClient, change);
      } else if (change.dataBase === "module") {
        await syncOfflineChangesModule(token, queryClient, change);
      } else if (change.dataBase === "lesson") {
        await syncOfflineChangesLesson(token, queryClient, change);
      } else if (change.dataBase === "resource") {
        await syncOfflineChangesResource(token, queryClient, change);
      }

      // Supprimer le changement synchronisé de IndexedDB
      await db.offlineChanges.delete(change.id);
      // attendre 1 second apres chaque nouvele requete
      await delay(1000);
    } catch (error) {
      console.error("Error syncing change:", change, error);
    }
  }
};
