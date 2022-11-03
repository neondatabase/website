import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Link from 'components/shared/link';

const Breadcrumbs = ({ breadcrumbs }) => (
  <div className="mb-5 flex space-x-1 text-sm ">
    {breadcrumbs.map(({ title, path }, index) => (
      <Fragment key={index}>
        <span className={clsx(index === 0 && 'hidden')}>/</span>
        {path ? (
          <Link className="text-gray-4 hover:text-black" to={path}>
            {title}
          </Link>
        ) : (
          <span className="text-gray-4">{title}</span>
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
