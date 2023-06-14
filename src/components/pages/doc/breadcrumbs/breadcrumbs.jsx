import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';

const Breadcrumbs = ({ breadcrumbs }) => (
  <div className="mb-4 flex space-x-1 text-sm leading-none text-gray-new-50 dark:text-gray-6">
    {breadcrumbs.map(({ title, slug }, index) => (
      <Fragment key={index}>
        {index !== 0 && <span>/</span>}
        {slug ? (
          <Link
            className="transition-colors duration-200 hover:text-black"
            to={DOCS_BASE_PATH + slug}
          >
            {title}
          </Link>
        ) : (
          <span>{title}</span>
        )}
      </Fragment>
    ))}
  </div>
);

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
    })
  ).isRequired,
};

export default Breadcrumbs;
