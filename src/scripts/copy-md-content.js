/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

const fs = require('fs').promises;
const path = require('path');

const { CONTENT_ROUTES } = require('../constants/content');

const copyMarkdownFiles = async (src, dest) => {
  // Create destination directory if it doesn't exist
  await fs.mkdir(dest, { recursive: true });

  // Read all items in the source directory
  const items = await fs.readdir(src, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      // If item is a directory, recurse
      await copyMarkdownFiles(srcPath, destPath);
    } else if (item.isFile() && path.extname(item.name) === '.md') {
      // If item is a Markdown file, copy it
      await fs.copyFile(srcPath, destPath);
    }
  }
};

(async () => {
  console.log('Copying markdown content...');
  try {
    const copyTasks = Object.entries(CONTENT_ROUTES).map(([route, srcPath]) => {
      const destPath = `public/md/${route}`;
      return copyMarkdownFiles(srcPath, destPath);
    });

    await Promise.all(copyTasks);

    console.log('Done copying markdown content.');
  } catch (err) {
    console.error('Error occurred while copying markdown files:', err);
  }
})();
