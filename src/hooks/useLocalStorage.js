import { useState, useEffect, useCallback } from "react";

function useLocalStorage(key, initialValue) {
  // 🔹 initial load (localStorage mathi levu)
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  });

  // 🔹 wrapper to set state, localStorage, and dispatch sync event
  const setValueWrapped = useCallback((newValue) => {
    setValue((currentValue) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(currentValue) : newValue;
        localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new CustomEvent(`local-storage-${key}`, { detail: valueToStore }));
        return valueToStore;
      } catch (error) {
        console.error("Error writing localStorage:", error);
        return currentValue;
      }
    });
  }, [key]);

  // 🔹 sync across tabs AND within the same window
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.type === "storage" && e.key === key) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          console.error("Error parsing localStorage:", error);
        }
      } else if (e.type === `local-storage-${key}`) {
        setValue(e.detail);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(`local-storage-${key}`, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(`local-storage-${key}`, handleStorageChange);
    };
  }, [key, initialValue]);

  return [value, setValueWrapped];
}

export default useLocalStorage;