'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import PropTypes from 'prop-types';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import debounce from 'utils/debounce';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

const debouncedSetUiState = debounce((uiState, setUiState) => setUiState(uiState), 100);

const onStateChange = ({ uiState, setUiState, indexName }) => {
  const { [indexName]: { query } = {} } = uiState;

  // debounce only non-empty query
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
    routing={{
      // customize search urls to ?query=... format
      router: {
        createURL: ({ qsModule, routeState, location }) => {
          const { pathname } = location;
          const basePath = pathname.split('/')[1];
          const queryParameters = {};

          if (routeState.query) {
            queryParameters.query = encodeURIComponent(routeState.query);
          }

          const queryString = qsModule.stringify(queryParameters, {
            addQueryPrefix: true,
            arrayFormat: 'repeat',
          });

          return `/${basePath}${queryString}`;
        },
        parseURL: ({ qsModule, location }) => {
          const { query = '' } = qsModule.parse(location.search.slice(1));
          return { query: decodeURIComponent(query) };
        },
      },
      stateMapping: {
        stateToRoute(uiState) {
          const indexUiState = uiState[indexName] || {};
          return { query: indexUiState.query };
        },

        routeToState(routeState) {
          return { [indexName]: { query: routeState.query } };
        },
      },
    }}
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
