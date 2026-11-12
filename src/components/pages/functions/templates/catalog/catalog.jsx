import { Suspense } from 'react';

import { getFunctionTemplateInstallTotals } from 'utils/api-function-template-installs';
import { getFunctionRegistryCatalog } from 'utils/function-registry';

import CatalogClient from './catalog-client';

const Catalog = async () => {
  const [templates, installTotals] = await Promise.all([
    getFunctionRegistryCatalog(),
    getFunctionTemplateInstallTotals(),
  ]);
  const templatesWithInstalls = templates.map((template) => ({
    ...template,
    installs: installTotals.get(template.id)?.installs ?? null,
  }));

  return (
    <Suspense>
      <CatalogClient templates={templatesWithInstalls} />
    </Suspense>
  );
};

export default Catalog;
