import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import getChangelogPostDateFromSlug from 'utils/get-changelog-post-date-from-slug';

const Aside = ({ slug, label }) => (
  <aside className="absolute left-6 top-0.5 flex min-w-fit max-w-fit flex-col items-end rounded-md xl:sticky xl:top-10 xl:mt-0 xl:mr-9 xl:max-h-24 sm:static sm:max-h-max sm:items-start">
    <Link className="transition-colors duration-200 hover:text-primary-2" to={slug}>
      <time
        className="whitespace-nowrap text-2xl font-semibold leading-none xl:text-xl"
        dateTime={getChangelogPostDateFromSlug(slug)}
      >
        {getChangelogPostDateFromSlug(slug)}
      </time>
    </Link>
    <span className="mt-3.5 block rounded-[50px] bg-secondary-2 py-1 px-4 text-sm font-semibold leading-snug">
      {label}
    </span>
  </aside>
);

Aside.propTypes = {
  slug: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Aside;
