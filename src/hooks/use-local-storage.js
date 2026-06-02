'use client';

const { useState, useEffect } = require('react');

function useLocalStorage(key, initialValue) {
  // Always start with `initialValue` so server HTML matches the client's first
  // render (hydration). Reading localStorage in useState would diverge when a
  // value exists in the browser but not on the server (e.g. defaultTab for Tabs).
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }, [key]);
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export default useLocalStorage;
