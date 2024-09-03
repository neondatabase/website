'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import CtrlKIcon from 'icons/ctrl-k.inline.svg';
import SearchIcon from 'icons/search.inline.svg';

const InkeepSearch = ({ className = null, handleClick }) => (
  <div className={clsx('relative flex items-center justify-between ', className)}>
    <button
      className="flex h-8 w-full items-center justify-between rounded border border-gray-new-90 bg-white p-[7px] transition-colors duration-200 hover:border-gray-new-70 dark:border-[#1D1E20] dark:bg-[#0F1010] dark:hover:border-gray-new-20 lg:items-start lg:border-none lg:px-3 lg:py-0"
      type="button"
      onClick={() => handleClick('SEARCH')} // WHY HANDLE CLICK IS NOT WORKING?
    >
      <span className="flex items-center gap-x-1.5">
        <SearchIcon className="h-[18px] w-[18px] text-gray-new-50 lg:h-6 lg:w-6 lg:text-black-new lg:dark:text-white" />
        <span className="text-sm leading-none tracking-extra-tight text-gray-new-50 lg:hidden">
          Search
        </span>
      </span>
      <span className="rounded-sm border border-gray-new-90 p-[3px] dark:border-gray-new-20 lg:hidden">
        <CtrlKIcon className="h-[9px] w-[18px] text-gray-new-10 dark:text-gray-new-80" />
      </span>
    </button>
  </div>
);

InkeepSearch.propTypes = {
  className: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
};

export default InkeepSearch;
