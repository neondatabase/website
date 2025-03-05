'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { SearchBox } from 'react-instantsearch';

import Link from 'components/shared/link';

const SearchInput = ({ className, basePath, withAlgolia }) => {
  /**
   * Handle keyboard shortcuts for search box without using ref
   * https://www.algolia.com/doc/guides/building-search-ui/upgrade-guides/react/#replace-focusshortcuts-with-custom-code
   */
  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      document.querySelector('.ais-SearchBox-input').focus();
    }
    if (event.key === 'Escape') {
      document.querySelector('.ais-SearchBox-input').blur();
    }
  };

  useEffect(() => {
    document.querySelector('.ais-SearchBox-input').focus();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={clsx('relative', className)}>
      {withAlgolia ? (
        <SearchBox placeholder="Search..." />
      ) : (
        <Link className="ais-SearchBox-input text-white/50" to={`${basePath}/search`}>
          Search...
        </Link>
      )}
      <span
        className={clsx(
          'pointer-events-none absolute right-1.5 top-1/2 z-10 flex h-5 -translate-y-1/2 items-center px-1.5',
          'rounded-[3px] border border-gray-new-90 bg-white text-xs font-medium text-black-pure',
          'dark:border-gray-new-20 dark:bg-black-pure dark:text-white',
          'md:hidden'
        )}
      >
        ⌘K
        <span className="sr-only">Press ⌘K to focus on the search input</span>
      </span>
    </div>
  );
};

SearchInput.propTypes = {
  className: PropTypes.string,
  basePath: PropTypes.string,
  withAlgolia: PropTypes.bool,
};

export default SearchInput;
