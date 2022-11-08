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
        'mt-1.5 block text-xs leading-relaxed text-gray-2',
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
      className={clsx('mt-4 divide-y', isMobileSearch ? 'divide-gray-7' : 'divide-gray-9 px-2.5')}
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
    'absolute left-0 right-0 bottom-0 z-10 translate-y-full overflow-hidden rounded-b border-t-0 rounded-b border border-gray-5',
  mobile: 'px-4',
  notFound: 'rounded-b-[29px] border-2 border-gray-2',
};

const containerClassNames = {
  default: 'max-h-[70vh]',
  notFound: 'max-h-[70vh] px-3.5 xs:px-0',
};

const Results = ({ indices, type }) => {
  const [shouldShowAllResultsButton, setShouldShowAllResultsButton] = useState(false);
  const [allResultsShown, setAllResultsShown] = useState(false);
  const [containerHeight, setContainerHeight] = useState(null);
  const { height } = useWindowSize();
  const isMobileSearch = type === 'mobile';
  const isNotFoundPage = type === 'notFound';

  useEffect(() => {
    // 102px is the height of the search input and footer of the search results
    setContainerHeight(`${height - 102}px`);
  }, [height]);

  return (
    <div className={clsx('bg-white', resultsClassNames[type])}>
      <div
        className={clsx('overflow-y-scroll pt-2.5', containerClassNames[type])}
        style={{ maxHeight: containerHeight }}
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
          'mt-2.5 flex justify-between p-2.5',
          isNotFoundPage && 'rounded-b-[29px] px-6 xs:px-2.5',
          isMobileSearch ? 'bg-white px-0' : 'bg-gray-9'
        )}
      >
        {!allResultsShown && shouldShowAllResultsButton && (
          <button
            className={clsx(
              'flex items-baseline space-x-1.5 text-xs transition-colors duration-200',
              isMobileSearch
                ? 'font-semibold leading-tight text-secondary-8'
                : 'font-bold uppercase leading-none text-primary-1 hover:text-[#00e5bf]'
            )}
            type="button"
            onClick={() => setAllResultsShown(!allResultsShown)}
          >
            <span>View all</span>
            <ChevronBottomIcon />
          </button>
        )}
        <Link
          className="ml-auto flex items-center space-x-2 text-xs text-gray-9"
          to="https://www.algolia.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Search by Algolia</span>
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
