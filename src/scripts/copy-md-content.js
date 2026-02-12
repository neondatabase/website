/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

/**
 * Post-build script to process MDX content into LLM-friendly markdown
 *
 * This script processes all content routes, converting MDX components
 * into clean markdown that AI agents can understand.
 */

const path = require('path');

const { CONTENT_ROUTES } = require('../constants/content');

const { processAllContent } = require('./process-md-for-llms');

(async () => {
  console.log('Processing markdown content for LLMs...\n');
  try {
    const projectRoot = path.resolve(__dirname, '../..');
    await processAllContent(CONTENT_ROUTES, projectRoot);
    console.log('\nDone processing markdown content.');
  } catch (err) {
    console.error('Error occurred while processing markdown files:', err);
    process.exit(1);
  }
})();
