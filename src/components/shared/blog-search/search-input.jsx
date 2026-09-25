'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import SearchClearButton from 'components/shared/search-clear-button';
import { cn } from 'utils/cn';

const SearchInput = ({ className, value, onChange, asPlaceholder }) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  /**
   * Handle keyboard shortcuts for search box
   */
  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      inputRef.current?.focus();
    }
    if (event.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={cn('absolute top-1 right-0 md:w-full', className)}>
      <div className="ais-SearchBox relative">
        <input
          ref={inputRef}
          className={cn('ais-SearchBox-input', asPlaceholder && 'pointer-events-none')}
          disabled={asPlaceholder}
          placeholder="Search..."
          aria-label="Search blog posts"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {!asPlaceholder && value?.length > 0 && (
          <SearchClearButton
            className="text-gray-new-50 hover:text-black-new dark:text-gray-new-60 dark:hover:text-white"
            onClick={handleClear}
          />
        )}
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  asPlaceholder: PropTypes.bool,
};

export default SearchInput;
