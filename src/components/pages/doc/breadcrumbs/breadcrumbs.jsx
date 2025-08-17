import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH, POSTGRESQL_BASE_PATH } from 'constants/docs';
import HomeIcon from 'icons/docs/home.inline.svg';

const linkClassName = 'transition-colors duration-200 hover:text-black dark:hover:text-white';

const Breadcrumbs = ({ breadcrumbs, isPostgresPost = false }) => (
  <div className="mb-4 flex flex-wrap items-center gap-x-2 text-sm leading-normal text-gray-new-40 dark:text-gray-new-60">
    <Link className={linkClassName} to={isPostgresPost ? POSTGRESQL_BASE_PATH : DOCS_BASE_PATH}>
      <HomeIcon />
    </Link>

    {breadcrumbs.map(({ title, slug }, index) => {
      const isLast = index === breadcrumbs.length - 1;
      return (
        <Fragment key={index}>
          <span>/</span>
          {slug ? (
            <Link
              className={linkClassName}
              to={isPostgresPost ? `${POSTGRESQL_BASE_PATH}${slug}` : `${DOCS_BASE_PATH}${slug}`}
            >
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
  isPostgresPost: PropTypes.bool,
};

export default Breadcrumbs;
