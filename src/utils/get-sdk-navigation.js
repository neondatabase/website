import fs from 'fs';
import path from 'path';

import { SDK_REFERENCE_PAGES } from 'constants/docs';

async function getSDKNavigation(slug) {
  // Check if this is an SDK reference page
  if (!SDK_REFERENCE_PAGES.includes(slug)) {
    return null;
  }

  try {
    // Extract SDK name from slug (e.g., 'reference/javascript-sdk' -> 'javascript-sdk')
    const sdkName = slug.split('/').pop();
    const filePath = path.join(process.cwd(), 'public', 'docs', 'reference', `${sdkName}-nav.json`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // eslint-disable-next-line no-console
      console.warn(`SDK navigation file not found: ${filePath}`);
      return null;
    }

    // Read and parse JSON file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const sdkNav = JSON.parse(fileContents);

    return {
      title: sdkNav.title || 'SDK Reference',
      sections: sdkNav.sections || [],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to load SDK navigation for ${slug}:`, error);
    return null;
  }
}

export default getSDKNavigation;
