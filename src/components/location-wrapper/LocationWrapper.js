import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function LocationWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    console.log("Changement de route détecté", location.pathname);
    shouldRefreshContent().then((shouldRefresh) => {
      if (shouldRefresh) {
        refreshContent();
      }
    });
  }, [location]);

  const shouldRefreshContent = () => {
    return caches.match(window.location.href).then((cachedResponse) => {
      if (!cachedResponse) {
        console.log("Page non en cache, rafraîchissement requis");
        return true;
      }
      console.log("Page en cache, pas de rafraîchissement nécessaire");
      return false;
    });
  };

  const refreshContent = () => {
    console.log("Rafraîchissement du contenu");
    window.location.reload();
  };

  return <>{children}</>; // Rendre les enfants sans modification
}

export default LocationWrapper;
