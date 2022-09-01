import PropTypes from 'prop-types';
import React from 'react';

import getChangelogPostDateFromSlug from 'utils/get-changelog-post-date-from-slug';

const Aside = ({ slug, label }) => (
  <aside className="absolute right-[calc(100%+5.625rem)] top-3 flex min-w-fit max-w-fit flex-col items-end rounded-md text-sm xl:sticky xl:top-10 xl:mt-3 xl:mr-5 xl:max-h-24 sm:static sm:max-h-max sm:items-start">
    <time className="whitespace-nowrap" dateTime={getChangelogPostDateFromSlug(slug)}>
      {getChangelogPostDateFromSlug(slug)}
    </time>
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
