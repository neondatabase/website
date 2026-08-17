'use client';

const { useState, useEffect, useCallback } = require('react');

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

  // Stable setter: uses functional setState so storedValue is never captured in
  // the closure. Without useCallback, a new reference is created every render,
  // which causes effects that list setValue as a dep to re-run and override user tab selections.
  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.log(error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
