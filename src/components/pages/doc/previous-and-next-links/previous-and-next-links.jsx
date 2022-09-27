import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import ArrowIcon from 'icons/arrow-right.inline.svg';

const PreviousAndNextLinks = ({ previousLink, nextLink }) => (
  <div className="mt-16 flex w-full space-x-4">
    {previousLink && (
      <Link
        to={`${DOCS_BASE_PATH}${previousLink.slug}`}
        size="md"
        theme="black-primary-1"
        className="mr-auto flex xs:items-baseline xs:space-x-3 xs:!leading-tight xs:before:hidden"
      >
        <ArrowIcon className="hidden shrink-0 rotate-180 xs:block" />
        <span>{previousLink.title}</span>
      </Link>
    )}
    {nextLink && (
      <Link
        to={`${DOCS_BASE_PATH}${nextLink.slug}`}
        size="md"
        theme="black-primary-1"
        className="ml-auto flex text-right xs:items-baseline xs:space-x-3 xs:!leading-tight xs:before:hidden"
      >
        <span
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
        <ArrowIcon className="hidden shrink-0 xs:block" />
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
