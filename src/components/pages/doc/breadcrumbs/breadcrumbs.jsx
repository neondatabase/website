import PropTypes from 'prop-types';
import React, { Fragment, useMemo } from 'react';

const convertPathToTitle = (path) => {
  const crumbLabel = path
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return crumbLabel;
};

const Breadcrumbs = ({ slug }) => {
  const breadcrumbLabels = useMemo(() => {
    const labels = slug
      .split('/')
      .slice(0, -1)
      .map((path) => convertPathToTitle(path));
    return labels;
  }, [slug]);

  return (
    <div className="mb-5 flex space-x-1 text-gray-4">
      <span>Documentation</span>

      {breadcrumbLabels.map((title, index) => (
        <Fragment key={index}>
          <span>/</span>
          <span>{title}</span>
        </Fragment>
      ))}
    </div>
  );
};

Breadcrumbs.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default Breadcrumbs;
