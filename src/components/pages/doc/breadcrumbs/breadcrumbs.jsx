import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';

const Breadcrumbs = ({ breadcrumbs }) => (
  <div className="mb-5 flex space-x-1 text-sm text-gray-4">
    {breadcrumbs.map(({ title, path }, index) => (
      <Fragment key={index}>
        {index !== 0 && <span>/</span>}
        {path ? (
          <Link className="hover:text-black" to={DOCS_BASE_PATH + path}>
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
      path: PropTypes.string,
    })
  ).isRequired,
};

export default Breadcrumbs;
