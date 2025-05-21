/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

import { promises as fs } from 'fs';
import path from 'path';

const copyMarkdownFiles = async (src: string, dest: string): Promise<void> => {
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
  console.log('Copying docs markdown...');
  try {
    await copyMarkdownFiles('content/docs', 'public/md/docs');
    console.log('Done copying Markdown files.');
  } catch (err) {
    console.error('Error occurred while copying Markdown files:', err);
  }
})();
