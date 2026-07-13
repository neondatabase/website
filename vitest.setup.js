import '@testing-library/jest-dom/vitest';

// Some vitest workers (pure Node environment) don't expose localStorage.
// Provide a no-op shim so tests that call localStorage.clear() don't crash.
if (typeof localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => {
      store[k] = String(v);
    },
    removeItem: (k) => {
      delete store[k];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  };
}
