import React, { useEffect } from "react";
import { useQueryClient } from "react-query";

const useOnlineStatusRefetch = (queryKey) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      console.log("Refetching data because the user is online.");
      queryClient.refetchQueries(queryKey, { exact: true });
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [queryClient, queryKey]);

  // Refetch immediately if already online
  useEffect(() => {
    if (navigator.onLine) {
      console.log("Refetching data because the user is already online.");
      queryClient.refetchQueries(queryKey, { exact: true });
    }
  }, [queryClient, queryKey]);
};

export default useOnlineStatusRefetch;
