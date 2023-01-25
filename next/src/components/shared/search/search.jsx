'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { InstantSearch, Configure } from 'react-instantsearch-dom';

import useAlgoliaSearch from 'hooks/use-algolia-search';
import useClickOutside from 'hooks/use-click-outside';

import Input from './input';
import Results from './results';

const indices = [
  { name: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME, title: 'Docs', hitComp: 'postPageHit' },
];

const Search = ({ className = null, isNotFoundPage = false }) => {
  const ref = useRef(null);
  const { query, setQuery, setFocus, hasFocus, searchClient } = useAlgoliaSearch();

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
        {shouldShowResult && (
          <Results indices={indices} type={isNotFoundPage ? 'notFound' : 'default'} />
        )}
      </InstantSearch>
    </div>
  );
};

Search.propTypes = {
  className: PropTypes.string,
  isNotFoundPage: PropTypes.bool,
};

export default Search;
