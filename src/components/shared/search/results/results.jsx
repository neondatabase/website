import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Index,
  connectHits,
  connectHitInsights,
  connectStateResults,
  Highlight,
  Snippet,
} from 'react-instantsearch-dom';
import { useWindowSize } from 'react-use';
import aa from 'search-insights';

import Link from 'components/shared/link';

import AlgoliaLogo from './images/algolia-logo.inline.svg';
import ChevronBottomIcon from './images/chevron-bottom.inline.svg';

const HitCount = connectStateResults(
  ({ searchResults, setShouldShowAllResultsButton, isMobileSearch }) => {
    const hitCount = searchResults?.nbHits;
    const query = searchResults?.query;

    useEffect(() => {
      if (searchResults?.nbHits && searchResults?.nbHits > 5) {
        setShouldShowAllResultsButton(true);
      } else {
        setShouldShowAllResultsButton(false);
      }
    }, [setShouldShowAllResultsButton, searchResults?.nbHits]);

    return (
      <div className={clsx('text-xs', !isMobileSearch && 'px-2.5')}>
        <span className="text-gray-5">
          {hitCount || 'No'} result{hitCount !== 1 || hitCount === 0 ? `s` : ``} for
        </span>{' '}
        &quot;{query}&quot;
      </div>
    );
  }
);

const PageHit = ({ hit, insights, isNotFoundPage }) => (
  <div className="with-highlighted-text">
    <Link
      className="block"
      to={hit.slug}
      onClick={() =>
        insights('clickedObjectIDsAfterSearch', {
          eventName: 'Search Result Clicked',
        })
      }
    >
      <h4
        className={clsx('highlight-text font-semibold', isNotFoundPage ? 'text-base' : 'text-sm')}
      >
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
    <Snippet
      className={clsx(
        'mt-1.5 block text-xs leading-relaxed text-gray-2 dark:text-gray-7',
        isNotFoundPage ? 'text-sm' : 'text-xs'
      )}
      attribute="excerpt"
      hit={hit}
      tagName="mark"
    />
  </div>
);

PageHit.propTypes = {
  hit: PropTypes.shape({
    objectID: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  insights: PropTypes.func.isRequired,
  isNotFoundPage: PropTypes.bool,
};

PageHit.defaultProps = {
  isNotFoundPage: false,
};

const HitWithInsights = connectHitInsights(aa)(PageHit);

const Hits = connectHits(({ hits, showAll, isNotFoundPage, isMobileSearch }) =>
  hits?.length ? (
    <ul
      className={clsx(
        'mt-4 divide-y dark:divide-gray-3',
        isMobileSearch ? 'divide-gray-7 ' : 'divide-gray-9 px-2.5'
      )}
    >
      {hits.slice(0, showAll ? hits.length : 5).map((hit) => (
        <li className="py-2.5 first:pt-0" key={hit.objectID}>
          <HitWithInsights isNotFoundPage={isNotFoundPage} hit={hit} />
        </li>
      ))}
    </ul>
  ) : null
);

const resultsClassNames = {
  default:
    'absolute left-0 right-0 bottom-0 z-10 translate-y-full overflow-hidden rounded-b border-t-0 rounded-b border border-gray-5 dark:border-gray-4',
  mobile: 'flex flex-col h-[calc(100%-58px)]', // 58px is the height of the search input
  notFound:
    'rounded-b-[29px] border-2 border-gray-2 absolute left-0 right-0 bottom-0 z-10 translate-y-full overflow-hidden',
};

const containerClassNames = {
  default: 'max-h-[70vh]',
  mobile: 'px-4',
  notFound: 'max-h-[40vh] px-3.5 xs:px-0',
};

const searchFooterClassNames = {
  default: 'ml-auto xl:ml-0 xl:space-y-3.5 xl:flex xl:flex-col',
  mobile: 'mt-auto flex grow flex-col items-center px-4',
  notFound: 'rounded-b-[29px] px-6 xs:px-2.5',
};

const Results = ({ indices, type }) => {
  const [shouldShowAllResultsButton, setShouldShowAllResultsButton] = useState(false);
  const [allResultsShown, setAllResultsShown] = useState(false);
  const [containerHeight, setContainerHeight] = useState(null);
  const { height } = useWindowSize();
  const isMobileSearch = type === 'mobile';
  const isNotFoundPage = type === 'notFound';

  useEffect(() => {
    // 94px is the height of the search input and footer of the search results
    setContainerHeight(`${height - 94}px`);
  }, [height]);

  return (
    <div className={clsx('bg-white dark:bg-black dark:text-white', resultsClassNames[type])}>
      <div
        className={clsx('overflow-x-hidden overflow-y-scroll py-2.5', containerClassNames[type])}
        style={{ maxHeight: isMobileSearch && containerHeight }}
      >
        {indices.map(({ name }) => (
          <Index indexName={name} key={name}>
            <HitCount
              setShouldShowAllResultsButton={setShouldShowAllResultsButton}
              isMobileSearch={type === 'mobile'}
            />
            <Hits
              isNotFoundPage={isNotFoundPage}
              isMobileSearch={isMobileSearch}
              showAll={allResultsShown}
            />
          </Index>
        ))}
      </div>
      <div
        className={clsx(
          'flex justify-between bg-gray-9 p-2.5 dark:bg-gray-1',
          searchFooterClassNames[type]
        )}
      >
        {!allResultsShown && shouldShowAllResultsButton && (
          <button
            className={clsx(
              'flex items-baseline space-x-1.5 text-xs text-secondary-8 transition-colors duration-200 dark:text-primary-1',
              isMobileSearch ? 'mb-4 font-semibold leading-tight' : 'font-bold leading-none'
            )}
            type="button"
            onClick={() => setAllResultsShown(!allResultsShown)}
          >
            <span>View all</span>
            <ChevronBottomIcon />
          </button>
        )}
        <Link
          className={clsx('flex items-center space-x-2 text-xs text-gray-4 dark:text-gray-9')}
          to="https://www.algolia.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AlgoliaLogo />
        </Link>
      </div>
    </div>
  );
};

Results.propTypes = {
  indices: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      hitComp: PropTypes.string.isRequired,
    })
  ).isRequired,
  type: PropTypes.oneOf(['default', 'mobile', 'notFound']),
};

Results.defaultProps = {
  type: 'default',
};

export default Results;
