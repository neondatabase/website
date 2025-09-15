'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import CtrlKIcon from 'icons/ctrl-k.inline.svg';
import SearchIcon from 'icons/search.inline.svg';

const InkeepSearch = ({ className = null, handleClick, isNotFoundPage = false }) => (
  <div className={clsx('relative flex items-center justify-between', className)}>
    <button
      className={clsx(
        'flex items-center justify-between border-gray-new-90 bg-white transition-colors duration-200 hover:border-gray-new-70',
        'dark:border-gray-new-20 dark:bg-gray-new-8 dark:hover:border-gray-new-30',
        isNotFoundPage
          ? 'h-14 w-full max-w-[488px] rounded-full border-2 bg-[length:20px_20px] bg-[left_1.5rem_center] px-6 pl-6 lg:border-2'
          : 'h-8 w-[264px] rounded-lg border p-1 pl-2.5 xl:w-60 lg:w-auto lg:border-none lg:!bg-transparent lg:p-0'
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
            'leading-none tracking-extra-tight text-gray-new-30 dark:text-gray-new-70',
            isNotFoundPage ? 'text-xl lg:text-lg md:text-base' : 'text-[13px] lg:hidden'
          )}
        >
          Search{isNotFoundPage && ' for another page'}...
        </span>
      </span>
      <span className="rounded-sm border border-gray-new-90 p-[3px] dark:border-gray-new-20 lg:hidden">
        <CtrlKIcon className={clsx('h-auto w-6 text-gray-new-10 dark:text-gray-new-50')} />
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
