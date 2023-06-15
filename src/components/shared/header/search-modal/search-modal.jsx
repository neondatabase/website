import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import { ChatWidgetTrigger } from 'components/pages/doc/chat-widget';
import Input from 'components/shared/search/input';
import Results from 'components/shared/search/results';
import useAlgoliaSearch from 'hooks/use-algolia-search';

const indices = [
  { name: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME, title: 'Docs', hitComp: 'postPageHit' },
];

const SearchModal = ({ isOpen, closeModal }) => {
  const { query, setQuery, setFocus, hasFocus, searchClient } = useAlgoliaSearch();
  const shouldShowResult = !!query?.length && hasFocus;
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indices[0].name}
      onSearchStateChange={({ query }) => setQuery(query)}
    >
      <div
        className={clsx(
          isOpen ? 'block' : 'hidden',
          'fixed inset-0 z-[100] flex flex-col bg-gray-new-98 dark:bg-gray-new-10'
        )}
      >
        <Configure clickAnalytics />

        <div className="flex items-center space-x-4 border-b border-gray-7 bg-white px-4 py-2.5 dark:border-gray-3 dark:bg-gray-1">
          <Input
            className="grow"
            innerClassName="border active:border-secondary-8 dark:active:border-green-45 hover:border-secondary-8 dark:hover:border-green-45"
            hasFocus={hasFocus}
            inputRef={inputRef}
            isMobileSearch
            onFocus={() => setFocus(true)}
          />
          <button
            className="shrink text-sm font-semibold leading-tight text-secondary-8 dark:text-green-45"
            type="button"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
        {shouldShowResult ? (
          <Results indices={indices} type="mobile" />
        ) : (
          <span className="mt-3.5 block text-center text-xs leading-none text-gray-new-40">
            No recent searches
          </span>
        )}
        <div className="mt-auto w-full px-4 py-2.5">
          <ChatWidgetTrigger className="relative w-full justify-center rounded bg-gray-8 p-2.5 dark:border dark:border-gray-new-30 dark:bg-transparent" />
        </div>
      </div>
    </InstantSearch>
  );
};

SearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default SearchModal;
