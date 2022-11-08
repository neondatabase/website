import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';

import ArrowIcon from './images/arrow.inline.svg';

const PreviousAndNextLinks = ({ previousLink, nextLink }) => (
  <div className="mt-10 flex w-full space-x-10 sm:mt-7 sm:space-x-4 xs:space-x-0">
    {previousLink && (
      <Link
        to={`${DOCS_BASE_PATH}${previousLink.slug}`}
        className="group mr-auto flex w-1/2 items-center justify-between rounded border border-gray-7 p-4 sm:space-x-3 xs:hidden"
      >
        <ArrowIcon className="shrink-0 rotate-180 text-gray-5 transition-colors duration-200 group-hover:text-secondary-8 xs:block" />
        <div className="flex flex-col items-end">
          <span className="text-sm font-normal text-gray-3">Previous</span>
          <span className="text-right font-semibold transition-colors duration-200 group-hover:text-secondary-8">
            {previousLink.title}
          </span>
        </div>
      </Link>
    )}
    {nextLink && (
      <Link
        to={`${DOCS_BASE_PATH}${nextLink.slug}`}
        className="group ml-auto flex w-1/2 items-center justify-between rounded border border-gray-7 p-4 text-right sm:space-x-3 xs:w-full"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm font-normal text-gray-3">Next</span>
          <span
            className="text-left font-semibold transition-colors duration-200 group-hover:text-secondary-8"
            style={{
              display: 'webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            {nextLink.title}
          </span>
        </div>
        <ArrowIcon className="shrink-0 text-gray-5 transition-colors duration-200 group-hover:text-secondary-8 xs:block" />
      </Link>
    )}
  </div>
);

PreviousAndNextLinks.propTypes = {
  previousLink: PropTypes.exact({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }),
  nextLink: PropTypes.exact({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }),
};

PreviousAndNextLinks.defaultProps = {
  previousLink: null,
  nextLink: null,
};

export default PreviousAndNextLinks;
