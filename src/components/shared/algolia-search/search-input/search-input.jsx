'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { SearchBox } from 'react-instantsearch';

const SearchInput = ({ className, asPlaceholder }) => {
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
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={clsx('absolute right-0 top-1 md:w-full', className)}>
      {asPlaceholder ? (
        <div className="ais-SearchBox">
          <input
            className="ais-SearchBox-input pointer-events-none"
            placeholder="Search..."
            disabled
          />
        </div>
      ) : (
        <SearchBox className="w-96" placeholder="Search..." />
      )}
      <div className="pointer-events-none absolute right-1.5 top-1/2 z-10 flex h-5 -translate-y-1/2 items-center gap-2 px-1.5 text-xs font-medium text-black-pure dark:text-white">
        <span className="italic text-gray-5">Powered by Algolia</span>
        <span
          className={clsx(
            'rounded-[3px] border border-gray-new-90 bg-white ',
            'dark:border-gray-new-20 dark:bg-black-pure',
            'md:hidden'
          )}
        >
          ⌘K
          <span className="sr-only">Press ⌘K to focus on the search input</span>
        </span>
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  className: PropTypes.string,
  asPlaceholder: PropTypes.bool,
};

export default SearchInput;
