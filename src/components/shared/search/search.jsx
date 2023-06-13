'use client';

import { DocSearch } from '@docsearch/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useRef } from 'react';

import debounce from 'utils/debounce';

import Link from '../link/link';

const INDEX_NAME = 'neon';
const API_KEY = 'a975b8d2e7c08607b212bf690f8eb40a';
const APP_ID = 'RAPNCKAFQF';

const Search = ({ className = null }) => {
  const ref = useRef(null);

  return (
    <div className={clsx('relative flex items-center justify-between', className)} ref={ref}>
      <DocSearch
        appId={APP_ID}
        apiKey={API_KEY}
        indexName={INDEX_NAME}
        placeholder="Search..."
        transformSearchClient={(searchClient) => ({
          ...searchClient,
          search: debounce(searchClient.search, 500),
        })}
        hitComponent={({ hit, children }) => (
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
        )}
        transformItems={(items) =>
          items.map((item, index) => {
            // We transform the absolute URL into a relative URL to
            // leverage Next's preloading.
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
                item.type !== 'lvl1' && items.length > 1 && items[0].type === 'lvl1' && index !== 0,
              __is_first: () => index === 1,
              __is_last: () => index === items.length - 1 && index !== 0,
            };
          })
        }
        insights
      />
    </div>
  );
};

Search.propTypes = {
  className: PropTypes.string,
};

export default Search;
