import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

import SearchIcon from 'icons/search.inline.svg';

const Input = connectSearchBox(
  ({
    refine = () => null,
    currentRefinement = null,
    onFocus,
    hasFocus = false,
    isNotFoundPage,
    isMobileSearch,
    className,
    inputRef,
    innerClassName,
  }) => (
    <div className={clsx('relative', className)}>
      <SearchIcon
        className={clsx(
          'absolute top-1/2 -translate-y-1/2 text-gray-new-50 dark:text-gray-new-80',
          isNotFoundPage ? 'left-6 h-5 w-5 xs:left-3' : 'left-2.5 h-4 w-4'
        )}
      />
      <input
        className={clsx(
          'search-input w-full appearance-none bg-white text-black placeholder-gray-new-50 outline-none search-cancel:m-0 search-cancel:h-4 search-cancel:w-4 search-cancel:cursor-pointer search-cancel:appearance-none search-cancel:bg-[url("/images/close-light.svg")] search-cancel:bg-center search-cancel:bg-no-repeat dark:bg-gray-new-8 dark:text-white dark:placeholder-gray-new-80 search-cancel:dark:bg-[url("/images/close-dark.svg")]',
          isNotFoundPage
            ? 'h-16 rounded-[110px] border-2 border-gray-2 pl-14 pr-6 text-xl md:text-lg xs:pl-9 xs:pr-2.5 xs:text-base'
            : 'h-9 rounded border border-gray-new-80 pl-9 pr-2.5 dark:border-gray-new-30',
          isNotFoundPage && hasFocus && currentRefinement && 'rounded-[29px]',
          hasFocus && currentRefinement && !isMobileSearch && 'rounded-b-none border-b',
          innerClassName
        )}
        type="search"
        value={currentRefinement}
        placeholder={isNotFoundPage ? 'Search for other pages' : 'Search'}
        autoComplete="off"
        aria-label={isNotFoundPage ? 'Search for other pages' : 'Search'}
        ref={inputRef}
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

export default Input;
