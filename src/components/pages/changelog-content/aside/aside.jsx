import PropTypes from 'prop-types';
import React from 'react';

import getChangelogPostDateFromSlug from 'utils/get-changelog-post-date-from-slug';

const Aside = ({ version, slug }) => (
  <aside className="absolute -left-40 top-2 min-w-fit max-w-fit rounded-md border border-gray-4 xl:sticky xl:top-10 xl:mr-5 xl:max-h-20 sm:static sm:mb-3">
    <div className="border-b border-b-gray-4 py-2 px-3 text-2xl font-bold">
      v<span>{version}</span>
    </div>
    <time className="py-1.5 px-2.5 text-sm" dateTime={getChangelogPostDateFromSlug(slug)}>
      {getChangelogPostDateFromSlug(slug)}
    </time>
  </aside>
);

Aside.propTypes = {
  slug: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};

export default Aside;
