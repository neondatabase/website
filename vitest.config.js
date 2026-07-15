import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Match Next.js's automatic JSX runtime so .jsx files don't need an
  // `import React from 'react'` line just for the JSX transform. This is
  // a no-op for files that don't use JSX (most of our pure-helper tests).
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
  resolve: {
    // Mirrors jsconfig.json `baseUrl: src` — every top-level src/* directory is
    // importable as a bare specifier (e.g. `import foo from 'components/...'`).
    // Adding a new src/* subdir? Add it here too.
    alias: {
      '@': path.resolve(__dirname, './src'),
      app: path.resolve(__dirname, './src/app'),
      components: path.resolve(__dirname, './src/components'),
      config: path.resolve(__dirname, './src/config'),
      constants: path.resolve(__dirname, './src/constants'),
      contexts: path.resolve(__dirname, './src/contexts'),
      data: path.resolve(__dirname, './src/data'),
      hooks: path.resolve(__dirname, './src/hooks'),
      icons: path.resolve(__dirname, './src/icons'),
      lib: path.resolve(__dirname, './src/lib'),
      styles: path.resolve(__dirname, './src/styles'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },
});
