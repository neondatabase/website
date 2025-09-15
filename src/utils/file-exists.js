import fs from 'fs';

/**
 * Safely check if a file exists, only on server side
 * @param {string} filePath - The path to check
 * @returns {boolean} - True if file exists (server only), false otherwise
 */
const fileExists = (filePath) => {
  // Only run on server side
  if (typeof window !== 'undefined') {
    return false;
  }

  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
};

export default fileExists;
