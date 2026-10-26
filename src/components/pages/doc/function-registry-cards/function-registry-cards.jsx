import PropTypes from 'prop-types';

import { getFunctionRegistryCatalog } from 'utils/function-registry';

import FunctionRegistryCardsClient from './function-registry-cards-client';

const FunctionRegistryCards = async ({ searchable = false }) => {
  const templates = await getFunctionRegistryCatalog();
  return <FunctionRegistryCardsClient searchable={searchable} templates={templates} />;
};

FunctionRegistryCards.propTypes = {
  searchable: PropTypes.bool,
};

export default FunctionRegistryCards;
