'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { SearchBox } from 'react-instantsearch';

const SearchInput = ({ className, isBlog = false }) => {
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
    <div className="relative md:w-full">
      <SearchBox className={clsx(className, isBlog && 'dark')} placeholder="Search..." />
      <span className="pointer-events-none absolute right-1.5 top-1/2 z-10 flex h-5 -translate-y-1/2 items-center rounded-[3px] border border-gray-new-20 bg-black-pure px-1.5 text-xs font-medium text-white md:hidden">
        ⌘K
        <span className="sr-only">Press ⌘K to focus on the search input</span>
      </span>
    </div>
  );
};

SearchInput.propTypes = {
  className: PropTypes.string,
  isBlog: PropTypes.bool,
};

export default SearchInput;
