'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import SearchIcon from 'icons/search.inline.svg';

const InkeepSearch = ({ className = null, handleClick, isNotFoundPage = false }) => (
  <div className={clsx('relative flex items-center justify-between', className)}>
    <button
      className={clsx(
        'flex items-center justify-between border-gray-new-80 bg-gray-new-98 transition-colors duration-200 hover:border-gray-new-70',
        'dark:border-gray-new-20 dark:bg-black-new dark:hover:border-gray-new-30',
        isNotFoundPage
          ? 'h-14 w-full max-w-[488px] rounded-full border-2 bg-[length:20px_20px] bg-[left_1.5rem_center] px-6 pl-6 lg:border-2'
          : 'h-8 w-[264px] border p-1 pl-2.5 xl:w-60 lg:w-auto lg:border-none lg:!bg-transparent lg:p-0'
      )}
      type="button"
      onClick={() => handleClick('SEARCH')}
    >
      <span className={clsx('flex items-center', isNotFoundPage ? 'gap-x-2.5' : 'gap-x-1.5')}>
        <SearchIcon
          className={clsx(
            'text-gray-new-30 dark:text-gray-new-70',
            isNotFoundPage ? 'h-5 w-5' : 'size-3.5 lg:size-6 lg:text-black-new lg:dark:text-white'
          )}
        />
        <span
          className={clsx(
            'leading-none tracking-tight text-gray-new-40 dark:text-gray-new-60',
            isNotFoundPage ? 'text-xl lg:text-lg md:text-base' : 'text-[13px] lg:hidden'
          )}
        >
          Search{isNotFoundPage && ' for another page'}...
        </span>
      </span>
      <span className="inline-flex h-[22px] items-center justify-center border border-gray-new-80 px-1.5 py-1 font-sans text-sm font-medium leading-none tracking-extra-tight text-gray-new-50 dark:border-gray-new-20 lg:hidden">
        ⌘K
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
