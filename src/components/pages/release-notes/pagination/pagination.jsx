import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import ReactPaginate from 'react-paginate';

import { RELEASE_NOTES_BASE_PATH } from 'constants/docs';

import Arrow from './images/pagination-arrow.inline.svg';

const Pagination = ({ currentPageIndex, pageCount }) => {
  const pageLinkAndBreakLinkClassName =
    'flex justify-center items-center text-base font-semibold w-10 h-10 rounded-full transition-colors duration-200 mx-2 hover:text-primary-2 md:w-7 md:h-7 md:mx-0.5';
  const previousAndNextLinkClassName =
    'flex items-center text-base font-semibold space-x-2 transition-colors duration-200 hover:text-primary-2';

  const handlePageChange = ({ selected }) => {
    const navigatePath =
      selected === 0 ? RELEASE_NOTES_BASE_PATH : `${RELEASE_NOTES_BASE_PATH}${selected + 1}`;
    navigate(navigatePath);
  };

  return (
    <div className="safe-paddings mt-10 2xl:mt-8 xl:mt-7 md:mt-6">
      <ReactPaginate
        containerClassName="flex justify-center items-center"
        pageLinkClassName={pageLinkAndBreakLinkClassName}
        breakLinkClassName={pageLinkAndBreakLinkClassName}
        activeLinkClassName="bg-secondary-2 hover:!text-inherit"
        previousClassName="mr-auto hover:text-primary-2"
        nextClassName="ml-auto hover:text-primary-2"
        previousLinkClassName={previousAndNextLinkClassName}
        nextLinkClassName={previousAndNextLinkClassName}
        disabledClassName="opacity-0 invisible"
        previousLabel={
          <>
            <Arrow className="w-4" />
            <span className="md:hidden">Previous</span>
          </>
        }
        nextLabel={
          <>
            <span className="md:hidden">Next</span>
            <Arrow className="w-4 rotate-180" />
          </>
        }
        forcePage={currentPageIndex}
        pageCount={pageCount}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

Pagination.propTypes = {
  currentPageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
};

export default Pagination;
