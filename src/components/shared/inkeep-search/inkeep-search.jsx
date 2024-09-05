'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import CtrlKIcon from 'icons/ctrl-k.inline.svg';
import SearchIcon from 'icons/search.inline.svg';

const InkeepSearch = ({ className = null, handleClick, isNotFoundPage = false }) => (
  <div className={clsx('relative flex items-center justify-between', className)}>
    <button
      className={clsx(
        'flex w-full items-center justify-between border-gray-new-90 bg-white transition-colors duration-200 hover:border-gray-new-70 dark:border-[#1D1E20] dark:bg-[#0F1010] dark:hover:border-gray-new-20 dark:lg:bg-transparent',
        isNotFoundPage
          ? 'h-16 max-w-[488px] rounded-full border-2 bg-[length:20px_20px] bg-[left_1.5rem_center] px-6 pl-6 lg:border-2'
          : 'h-8 rounded border p-[7px] lg:items-start lg:border-none  lg:px-3 lg:py-0'
      )}
      type="button"
      onClick={() => handleClick('SEARCH')}
    >
      <span className={clsx('flex items-center', isNotFoundPage ? 'gap-x-2.5' : 'gap-x-1.5')}>
        <SearchIcon
          className={clsx(
            'text-gray-new-50 lg:h-6 lg:w-6 lg:text-black-new lg:dark:text-white',
            isNotFoundPage ? 'h-5 w-5' : 'h-[18px] w-[18px]'
          )}
        />
        <span
          className={clsx(
            'leading-none tracking-extra-tight text-gray-new-50 lg:hidden',
            isNotFoundPage ? 'text-xl' : 'text-sm'
          )}
        >
          Search
        </span>
      </span>
      <span className="rounded-sm border border-gray-new-90 p-[3px] dark:border-gray-new-20 lg:hidden">
        <CtrlKIcon
          className={clsx(
            'h-auto text-gray-new-10 dark:text-gray-new-80',
            isNotFoundPage ? 'w-6' : 'w-[18px]'
          )}
        />
      </span>
    </button>
  </div>
);

InkeepSearch.propTypes = {
  className: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  isNotFoundPage: PropTypes.bool,
};

export default InkeepSearch;
