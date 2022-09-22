import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Index,
  connectHits,
  connectStateResults,
  Highlight,
  Snippet,
} from 'react-instantsearch-dom';

import Link from 'components/shared/link';

import AlgoliaLogo from './images/algolia-logo.inline.svg';
import ChevronBottomIcon from './images/chevron-bottom.inline.svg';

const HitCount = connectStateResults(({ searchResults, setShouldShowAllResultsButton }) => {
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
    <div className="px-2.5 text-xs">
      <span className="text-gray-3">
        {hitCount || 'No'} result{hitCount !== 1 || hitCount === 0 ? `s` : ``} for
      </span>{' '}
      &quot;{query}&quot;
    </div>
  );
});

const PageHit = ({ hit, isNotFoundPage }) => (
  <div className="with-highlighted-text">
    <Link className="block" to={hit.slug}>
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
  isNotFoundPage: PropTypes.bool,
};

PageHit.defaultProps = {
  isNotFoundPage: false,
};

const Hits = connectHits(({ hits, showAll, isNotFoundPage }) =>
  hits?.length ? (
    <ul className="mt-4 divide-y divide-gray-3 px-2.5">
      {hits.slice(0, showAll ? hits.length : 5).map((hit) => (
        <li className="py-2.5 first:pt-0" key={hit.objectID}>
          <PageHit isNotFoundPage={isNotFoundPage} hit={hit} />
        </li>
      ))}
    </ul>
  ) : null
);

const Results = ({ indices, isNotFoundPage }) => {
  const [shouldShowAllResultsButton, setShouldShowAllResultsButton] = useState(false);
  const [allResultsShown, setAllResultsShown] = useState(false);

  return (
    <div
      className={clsx(
        'absolute left-0 right-0 bottom-0 z-10 translate-y-full overflow-hidden border-t-0 bg-white',
        isNotFoundPage
          ? 'rounded-b-[29px] border-2 border-gray-2'
          : 'rounded-b border border-gray-3 '
      )}
    >
      <div
        className={clsx(
          'max-h-[70vh] overflow-y-scroll pt-2.5',
          isNotFoundPage && 'px-3.5 xs:px-0'
        )}
      >
        {indices.map(({ name }) => (
          <Index indexName={name} key={name}>
            <HitCount setShouldShowAllResultsButton={setShouldShowAllResultsButton} />
            <Hits isNotFoundPage={isNotFoundPage} showAll={allResultsShown} />
          </Index>
        ))}
      </div>
      <div
        className={clsx(
          'mt-2.5 flex justify-between bg-gray-5 p-2.5',
          isNotFoundPage && 'px-6 xs:px-2.5'
        )}
      >
        {!allResultsShown && shouldShowAllResultsButton && (
          <button
            className="flex items-baseline space-x-1.5 text-xs font-bold uppercase leading-none text-primary-1 transition-colors duration-200 hover:text-[#00e5bf]"
            type="button"
            onClick={() => setAllResultsShown(!allResultsShown)}
          >
            <span>View all</span>
            <ChevronBottomIcon />
          </button>
        )}
        <Link
          className="ml-auto flex items-center space-x-2 text-xs text-gray-3"
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
  isNotFoundPage: PropTypes.bool,
};

Results.defaultProps = {
  isNotFoundPage: false,
};

export default Results;
