import { Suspense } from 'react';

import {
  SHOW_FUNCTION_TEMPLATE_INSTALLS,
  getFunctionTemplateInstallTotals,
} from 'utils/api-function-template-installs';
import { getFunctionRegistryCatalog } from 'utils/function-registry';

import CatalogClient from './catalog-client';

const Catalog = async () => {
  const [templates, installTotals] = await Promise.all([
    getFunctionRegistryCatalog(),
    SHOW_FUNCTION_TEMPLATE_INSTALLS ? getFunctionTemplateInstallTotals() : new Map(),
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
