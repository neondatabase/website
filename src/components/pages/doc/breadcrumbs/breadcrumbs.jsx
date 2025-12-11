import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH } from 'constants/docs';
import LINKS from 'constants/links';
import HomeIcon from 'icons/docs/home.inline.svg';

const linkClassName = 'transition-colors duration-200 hover:text-black dark:hover:text-white';

const Breadcrumbs = ({ breadcrumbs, baseUrl = DOCS_BASE_PATH }) => (
  <div className="mb-4 flex flex-wrap items-center gap-x-2 text-sm leading-normal text-gray-new-40 dark:text-gray-new-60">
    <Link className={linkClassName} to={baseUrl}>
      <HomeIcon />
    </Link>

    {breadcrumbs.map(({ title, slug }, index) => {
      const isLast = index === breadcrumbs.length - 1;
      const href = slug === 'guides' ? LINKS.guides : `${baseUrl}${slug}`;

      return (
        <Fragment key={index}>
          <span>/</span>
          {slug ? (
            <Link className={linkClassName} to={href}>
              {title}
            </Link>
          ) : (
            <span
              className={clsx(
                isLast ? 'text-black dark:text-white' : 'text-gray-new-40 dark:text-gray-new-60'
              )}
            >
              {title}
            </span>
          )}
        </Fragment>
      );
    })}
  </div>
);

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
    })
  ).isRequired,
  baseUrl: PropTypes.string.isRequired,
};

export default Breadcrumbs;
