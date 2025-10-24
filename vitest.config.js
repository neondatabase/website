import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      app: path.resolve(__dirname, './src/app'),
      constants: path.resolve(__dirname, './src/constants'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },
});
