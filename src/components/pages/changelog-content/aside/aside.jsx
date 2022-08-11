import PropTypes from 'prop-types';
import React from 'react';

import getChangelogPostDateFromSlug from 'utils/get-changelog-post-date-from-slug';

const Aside = ({ slug }) => (
  <aside className="absolute -left-40 top-2 min-w-fit max-w-fit rounded-md border border-gray-4 px-3 py-2 xl:sticky xl:top-10 xl:mr-5 xl:max-h-10 sm:static sm:mb-3">
    <time dateTime={getChangelogPostDateFromSlug(slug)}>{getChangelogPostDateFromSlug(slug)}</time>
  </aside>
);

Aside.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default Aside;
