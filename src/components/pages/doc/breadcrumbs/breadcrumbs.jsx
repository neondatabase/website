import { Breadcrumb } from 'gatsby-plugin-breadcrumb';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const crumbLabelUpdates = [
  {
    pathname: '/docs/cloud/',
    crumbLabel: 'Introduction',
  },
  {
    pathname: '/docs/how-to-guides/',
    crumbLabel: 'Import data',
  },
  {
    pathname: '/docs/get-started-with-neon/',
    crumbLabel: 'Get started',
  },
];

const convertPathToTitle = (path) => {
  const crumbLabel = path
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return crumbLabel;
};

const Breadcrumbs = ({ crumbs, title }) => {
  const crumbsWithLabel = useMemo(() => {
    const docCrumbs = crumbs.filter((crumb) => crumb.pathname.includes('/docs/'));

    return docCrumbs.map((crumb) => {
      const crumbLabelUpdate = crumbLabelUpdates.find(
        (update) => update.pathname === crumb.pathname
      );

      if (crumbLabelUpdate) {
        return { ...crumb, crumbLabel: crumbLabelUpdate.crumbLabel };
      }

      if (crumb.pathname === '/docs/') {
        return { ...crumb, crumbLabel: 'Documentation' };
      }
      return {
        ...crumb,
        crumbLabel: convertPathToTitle(crumb.crumbLabel),
      };
    });
  }, [crumbs]);
  return (
    <Breadcrumb className="mb-5" crumbs={crumbsWithLabel} crumbSeparator="/" crumbLabel={title} />
  );
};

Breadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.exact({
      pathname: PropTypes.string.isRequired,
      crumbLabel: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

Breadcrumbs.defaultProps = {};

export default Breadcrumbs;
