import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';

const PreviousAndNextLinks = ({ previousLink, nextLink }) => (
  <div className="mt-16 flex w-full space-x-4">
    {previousLink && (
      <Link
        to={`${DOCS_BASE_PATH}${previousLink.slug}`}
        size="md"
        theme="black-primary-1"
        className="mr-auto xs:!leading-tight"
      >
        {previousLink.title}
      </Link>
    )}
    {nextLink && (
      <Link
        to={`${DOCS_BASE_PATH}${nextLink.slug}`}
        size="md"
        theme="black-primary-1"
        className="ml-auto text-right xs:!leading-tight"
      >
        {nextLink.title}
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
