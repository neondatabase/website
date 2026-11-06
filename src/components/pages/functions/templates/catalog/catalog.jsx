import { Suspense } from 'react';

import { getFunctionRegistryCatalog } from 'utils/function-registry';

import CatalogClient from './catalog-client';

const Catalog = async () => {
  const templates = await getFunctionRegistryCatalog();

  return (
    <Suspense>
      <CatalogClient templates={templates} />
    </Suspense>
  );
};

export default Catalog;
