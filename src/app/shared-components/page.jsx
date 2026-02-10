import fs from 'node:fs/promises';
import path from 'node:path';

import SharedComponentsShowcase from 'components/pages/shared-components/shared-components-showcase';

const SHARED_COMPONENTS_PATH = path.join(process.cwd(), 'src/components/shared');

const getSharedComponents = async () => {
  const entries = await fs.readdir(SHARED_COMPONENTS_PATH, { withFileTypes: true });

  const components = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const directoryPath = path.join(SHARED_COMPONENTS_PATH, entry.name);
        const files = await fs.readdir(directoryPath);

        return {
          name: entry.name,
          importPath: `components/shared/${entry.name}`,
          sourcePath: `src/components/shared/${entry.name}`,
          hasIndex: files.includes('index.js'),
        };
      })
  );

  return components.sort((a, b) => a.name.localeCompare(b.name));
};

export const metadata = {
  title: 'Shared Components Showcase',
  description: 'Preview page for shared UI components',
};

const SharedComponentsPage = async () => {
  const components = await getSharedComponents();

  return <SharedComponentsShowcase components={components} />;
};

export default SharedComponentsPage;
