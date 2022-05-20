import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

import SearchIcon from './images/search.inline.svg';

const Input = connectSearchBox(({ refine, currentRefinement, onFocus, hasFocus }) => (
  <div className="relative">
    <SearchIcon className="absolute top-1/2 left-2.5 -translate-y-1/2" />
    <input
      id="search-input"
      className={clsx(
        'search-input h-9 w-full appearance-none rounded border border-gray-3 bg-white pl-9 pr-2.5 text-gray-3 placeholder-gray-3 outline-none',
        hasFocus && currentRefinement && 'rounded-b-none'
      )}
      type="search"
      value={currentRefinement}
      placeholder="Search"
      autoComplete="off"
      aria-label="Search"
      onChange={(e) => refine(e.target.value)}
      onFocus={onFocus}
    />
  </div>
));

Input.propTypes = {
  refine: PropTypes.func,
  currentRefinement: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  hasFocus: PropTypes.bool,
};

Input.defaultProps = {
  refine: () => null,
  currentRefinement: null,
  hasFocus: false,
};

export default Input;
