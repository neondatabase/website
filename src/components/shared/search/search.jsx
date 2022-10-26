import algoliasearch from 'algoliasearch/lite';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useRef, useState, useMemo } from 'react';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import aa from 'search-insights';

import useClickOutside from 'hooks/use-click-outside';
import algoliaQueries from 'utils/algolia-queries';

import Input from './input';
import Results from './results';

const indices = [{ name: algoliaQueries[0].indexName, title: 'Docs', hitComp: 'postPageHit' }];

// Initialization of the search-insights library
aa('init', {
  appId: process.env.GATSBY_ALGOLIA_APP_ID,
  apiKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  useCookie: true,
});

let userToken = '';
aa('getUserToken', null, (err, algoliaUserToken) => {
  if (err) {
    console.error(err);
    return;
  }

  userToken = algoliaUserToken;
});

aa('setUserToken', userToken);

const Search = ({ className, isNotFoundPage }) => {
  const ref = useRef(null);
  const [query, setQuery] = useState();
  const [hasFocus, setFocus] = useState(false);
  const searchClient = useMemo(
    () => algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_SEARCH_KEY),
    []
  );

  useClickOutside([ref], () => setFocus(false));

  const shouldShowResult = !!query?.length && hasFocus;

  return (
    <div className={clsx('relative', className)} ref={ref}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indices[0].name}
        onSearchStateChange={({ query }) => setQuery(query)}
      >
        <Configure clickAnalytics />
        <Input hasFocus={hasFocus} isNotFoundPage={isNotFoundPage} onFocus={() => setFocus(true)} />
        {shouldShowResult && <Results indices={indices} isNotFoundPage={isNotFoundPage} />}
      </InstantSearch>
    </div>
  );
};

Search.propTypes = {
  className: PropTypes.string,
  isNotFoundPage: PropTypes.bool,
};

Search.defaultProps = {
  className: null,
  isNotFoundPage: false,
};

export default Search;
