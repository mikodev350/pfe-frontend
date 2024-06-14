import React from "react";

export default function useStorage({ key, initialValue = null }) {
  const [storage, setUpdateStorage] = React.useState(() => {
    return localStorage.getItem(key) || initialValue;
  });

  const getStorage = React.useCallback(() => {
    return localStorage.getItem(key) || initialValue;
  }, [key, initialValue]);

  const setStorage = React.useCallback(
    (value) => {
      localStorage.setItem(key, value);
      setUpdateStorage(value);
    },
    [key]
  );

  React.useEffect(() => {
    setUpdateStorage(localStorage.getItem(key) || initialValue);
  }, [key, initialValue]);

  return [storage, getStorage, setStorage];
}
