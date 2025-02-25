'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import PropTypes from 'prop-types';
import { InstantSearch } from 'react-instantsearch';

import debounce from 'utils/debounce';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

const debouncedSetUiState = debounce((uiState, setUiState) => setUiState(uiState), 500);

const onStateChange = ({ uiState, setUiState, indexName }) => {
  const { [indexName]: { query } = {} } = uiState;

  if (!query) {
    setUiState({});
    return;
  }

  debouncedSetUiState(uiState, setUiState);
};

const AlgoliaSearch = ({ indexName, children }) => (
  <InstantSearch
    indexName={indexName}
    searchClient={searchClient}
    onStateChange={({ uiState, setUiState }) => onStateChange({ uiState, setUiState, indexName })}
  >
    {children}
  </InstantSearch>
);

AlgoliaSearch.propTypes = {
  indexName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AlgoliaSearch;
