'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const SearchInput = ({ className, value, onChange, asPlaceholder }) => {
  const inputRef = useRef(null);

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
    <div className={clsx('absolute right-0 top-1 md:w-full', className)}>
      <div className="ais-SearchBox">
        <input
          ref={inputRef}
          className={clsx('ais-SearchBox-input', asPlaceholder && 'pointer-events-none')}
          disabled={asPlaceholder}
          placeholder="Search..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
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
