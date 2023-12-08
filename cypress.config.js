require('dotenv').config();
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'f1g3w6',
  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL,
    viewportWidth: 1920,
    viewportHeight: 1200,
    setupNodeEvents(on, config) {
      config.env = {
        ...process.env,
        ...config.env,
      };
      return config;
    },
  },
});
