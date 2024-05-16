import React from "react";

export default function useStorage({ key, value }) {
  const [storage, setUpdateStorage] = React.useState(null);

  const getStorage = React.useCallback((key) => {
    return localStorage.getItem(key) || null;
  }, []);

  const setStorage = React.useCallback((key, value) => {
    localStorage.setItem(key, value);
    console.log(value);
  }, []);

  React.useEffect(() => {
    if (key) {
      setUpdateStorage(localStorage.getItem(key));
    }
  }, [key]);

  return [storage, getStorage, setStorage];
}
