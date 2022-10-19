import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

import SearchIcon from './images/search.inline.svg';

const Input = connectSearchBox(
  ({ refine, currentRefinement, onFocus, hasFocus, isNotFoundPage }) => (
    <div className="relative">
      <SearchIcon
        className={clsx(
          'absolute top-1/2 -translate-y-1/2',
          isNotFoundPage ? 'left-6 h-5 w-5 xs:left-3' : 'left-2.5 h-4 w-4'
        )}
      />
      <input
        id="search-input"
        className={clsx(
          'search-input w-full appearance-none bg-white text-black placeholder-gray-3 outline-none',
          isNotFoundPage
            ? 'h-16 rounded-[110px] border-2 border-gray-2 pl-14 pr-6 text-xl md:text-lg xs:pr-2.5 xs:pl-9 xs:text-base'
            : 'h-9 rounded border border-gray-3 pl-9 pr-2.5 ',
          isNotFoundPage && hasFocus && currentRefinement && 'rounded-[29px]',
          hasFocus && currentRefinement && 'rounded-b-none border-b'
        )}
        type="search"
        value={currentRefinement}
        placeholder={isNotFoundPage ? 'Search for other pages' : 'Search'}
        autoComplete="off"
        aria-label={isNotFoundPage ? 'Search for other pages' : 'Search'}
        onChange={(e) => refine(e.target.value)}
        onFocus={onFocus}
      />
    </div>
  )
);

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
