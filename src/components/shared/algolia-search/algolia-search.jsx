'use client';

import { DocSearchButton, DocSearchModal, useDocSearchKeyboardEvents } from '@docsearch/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Link from 'components/shared/link';
import debounce from 'utils/debounce';

const Hit = ({ hit, children }) => (
  <Link
    className={clsx({
      'DocSearch-Hit--Result': hit.__is_result?.(),
      'DocSearch-Hit--Parent': hit.__is_parent?.(),
      'DocSearch-Hit--FirstChild': hit.__is_first?.(),
      'DocSearch-Hit--LastChild': hit.__is_last?.(),
      'DocSearch-Hit--Child': hit.__is_child?.(),
    })}
    to={hit.url}
  >
    {children}
  </Link>
);

Hit.propTypes = {
  hit: PropTypes.shape({
    __is_result: PropTypes.func,
    __is_parent: PropTypes.func,
    __is_first: PropTypes.func,
    __is_last: PropTypes.func,
    __is_child: PropTypes.func,
    url: PropTypes.string,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

const AlgoliaSearch = ({ className = null, isBlog = false, indexName }) => {
  const router = useRouter();
  const searchButtonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState(null);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onInput = useCallback(
    (event) => {
      setIsOpen(true);
      setInitialQuery(event.key);
    },
    [setIsOpen, setInitialQuery]
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  // @NOTE: this is a workaround to prevent scroll to the page bottom when closing search modal in Safari
  // https://github.com/algolia/docsearch/issues/1260#issuecomment-1011939736
  useEffect(() => {
    let div = document.querySelector('.fixed[data-docsearch-fixed]');

    if (!div) {
      div = document.createElement('div');
      div.classList.add('fixed');
      div.setAttribute('data-docsearch-fixed', '');
      div.innerHTML = '<input type="text" aria-label="hidden">';
      document.body.appendChild(div);
    }
  }, []);

  return (
    <div className={clsx('relative flex items-center justify-between', className)}>
      <DocSearchButton
        ref={searchButtonRef}
        aria-label="Open search with CTRL+K or Command+K"
        onClick={onOpen}
      />
      {isOpen &&
        createPortal(
          <div className={clsx({ dark: isBlog })}>
            <DocSearchModal
              initialQuery={initialQuery}
              initialScrollY={window.scrollY}
              navigator={{
                navigate({ itemUrl }) {
                  setIsOpen(false);
                  router.push(itemUrl);
                },
              }}
              appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}
              apiKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY}
              indexName={indexName}
              placeholder="Search..."
              transformSearchClient={(searchClient) => ({
                ...searchClient,
                search: debounce(searchClient.search, 500),
              })}
              hitComponent={Hit}
              transformItems={(items) =>
                items.map((item, index) => {
                  // We transform the absolute URL into a relative URL to leverage next/link prefetch.
                  const a = document.createElement('a');
                  a.href = item.url;

                  if (item.hierarchy?.lvl0) {
                    item.hierarchy.lvl0 = item.hierarchy.lvl0.replace(/&amp;/g, '&');
                  }

                  if (item._highlightResult?.hierarchy?.lvl0?.value) {
                    item._highlightResult.hierarchy.lvl0.value =
                      item._highlightResult.hierarchy.lvl0.value.replace(/&amp;/g, '&');
                  }

                  return {
                    ...item,
                    url: `${a.pathname}${a.hash}`,
                    __is_result: () => true,
                    __is_parent: () => item.type === 'lvl1' && items.length > 1 && index === 0,
                    __is_child: () =>
                      item.type !== 'lvl1' &&
                      items.length > 1 &&
                      items[0].type === 'lvl1' &&
                      index !== 0,
                    __is_first: () => index === 1,
                    __is_last: () => index === items.length - 1 && index !== 0,
                  };
                })
              }
              insights
              onClose={onClose}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

AlgoliaSearch.propTypes = {
  className: PropTypes.string,
  isBlog: PropTypes.bool,
  indexName: PropTypes.string.isRequired,
};

export default AlgoliaSearch;
