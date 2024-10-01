import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

import Link from 'components/shared/link';
import { DOCS_BASE_PATH, POSTGRES_DOCS_BASE_PATH } from 'constants/docs';

const Breadcrumbs = ({ breadcrumbs, isPostgresPost = false }) => (
  <div className="mb-4 flex flex-wrap space-x-2 text-sm leading-normal text-gray-new-40 dark:text-gray-new-60 lg:hidden">
    <Link theme="black-white-hover" to={DOCS_BASE_PATH}>
      Docs
    </Link>
    <span>/</span>
    {isPostgresPost && (
      <>
        <Link theme="black-white-hover" to={POSTGRES_DOCS_BASE_PATH}>
          Postgres
        </Link>
        <span>/</span>
      </>
    )}

    {breadcrumbs.map(({ title, slug }, index) => {
      const isLast = index === breadcrumbs.length - 1;
      return (
        <Fragment key={index}>
          {index > 0 && <span>/</span>}
          {slug ? (
            <Link
              theme="black-white-hover"
              to={isPostgresPost ? `${POSTGRES_DOCS_BASE_PATH}${slug}` : `${DOCS_BASE_PATH}${slug}`}
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
