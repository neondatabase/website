import { Suspense } from 'react';

import { getFunctionTemplateInstallTotals } from 'utils/api-function-template-installs';
import { getFunctionRegistryCatalog } from 'utils/function-registry';

import CatalogClient, { CatalogView } from './catalog-client';

const Catalog = async () => {
  const [catalog, installTotals] = await Promise.all([
    getFunctionRegistryCatalog(),
    getFunctionTemplateInstallTotals(),
  ]);
  const templates = catalog.map((template) => ({
    ...template,
    installs: installTotals.get(template.id)?.installs ?? null,
  }));

  return (
    // URL filters resolve on the client for this prerendered route.
    <Suspense fallback={<CatalogView templates={templates} />}>
      <CatalogClient templates={templates} />
    </Suspense>
  );
};

export default Catalog;
