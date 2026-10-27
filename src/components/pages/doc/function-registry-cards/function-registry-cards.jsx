import PropTypes from 'prop-types';
import { Suspense } from 'react';


import { getFunctionRegistryCatalog } from 'utils/function-registry';

import FunctionRegistryCardsClient from './function-registry-cards-client';

const FunctionRegistryCards = async ({ searchable = false }) => {
  const templates = await getFunctionRegistryCatalog();
  return (
    <Suspense>
      <FunctionRegistryCardsClient searchable={searchable} templates={templates} />
    </Suspense>
  );
};

FunctionRegistryCards.propTypes = {
  searchable: PropTypes.bool,
};

export default FunctionRegistryCards;
