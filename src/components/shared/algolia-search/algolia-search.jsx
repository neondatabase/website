'use client';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import debounce from 'utils/debounce';

import SearchInput from './search-input';
import SearchResults from './search-results';

const debouncedSetUiState = debounce((uiState, setUiState) => setUiState(uiState), 100);

const AlgoliaSearch = ({ indexName, children, posts, searchInputClassName }) => {
  const [mounted, setMounted] = useState(false);

  // Initialize searchClient only if environment variables are available
  const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
  const algoliaCredsAvailable = algoliaAppId && algoliaApiKey;
  const searchClient = algoliaCredsAvailable ? algoliasearch(algoliaAppId, algoliaApiKey) : null;

  useEffect(() => setMounted(true), []);

  const onStateChange = ({ uiState, setUiState }) => {
    const { [indexName]: { query } = {} } = uiState;

    if (!query) {
      debouncedSetUiState.cancel();
      setUiState({});
      return;
    }

    debouncedSetUiState(uiState, setUiState);
  };

  // Fallback for missing Algolia credentials
  if (!algoliaCredsAvailable) return children;

  // Preloader
  if (!mounted)
    return (
      <>
        <SearchInput className={searchInputClassName} asPlaceholder />
        {children}
      </>
    );

  return (
    <InstantSearchNext
      indexName={indexName}
      searchClient={searchClient}
      routing={{
        // customize search urls to ?query=... format
        router: {
          createURL: ({ qsModule, routeState, location }) => {
            const { pathname } = location;
            if (!routeState.query) {
              return pathname;
            }

            const queryParameters = { query: encodeURIComponent(routeState.query) };
            const queryString = qsModule.stringify(queryParameters, {
              addQueryPrefix: true,
              arrayFormat: 'repeat',
            });

            return `${pathname}${queryString}`;
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
      onStateChange={onStateChange}
    >
      <SearchInput className={searchInputClassName} />
      <SearchResults posts={posts} indexName={indexName}>
        {children}
      </SearchResults>
    </InstantSearchNext>
  );
};

AlgoliaSearch.propTypes = {
  indexName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchInputClassName: PropTypes.string,
};

export default AlgoliaSearch;
