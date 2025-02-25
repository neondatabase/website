'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import PropTypes from 'prop-types';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import debounce from 'utils/debounce';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

const debouncedSetUiState = debounce((uiState, setUiState) => setUiState(uiState), 500);

const onStateChange = ({ uiState, setUiState, indexName }) => {
  const { [indexName]: { query } = {} } = uiState;

  // debounce only if non-empty query
  if (!query) {
    debouncedSetUiState.cancel();
    setUiState({});
    return;
  }

  debouncedSetUiState(uiState, setUiState);
};

const AlgoliaSearch = ({ indexName, children }) => (
  <InstantSearchNext
    indexName={indexName}
    searchClient={searchClient}
    routing
    onStateChange={({ uiState, setUiState }) => onStateChange({ uiState, setUiState, indexName })}
  >
    {children}
  </InstantSearchNext>
);

AlgoliaSearch.propTypes = {
  indexName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AlgoliaSearch;
