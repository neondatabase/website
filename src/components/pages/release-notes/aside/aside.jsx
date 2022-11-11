import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link';
import generateReleaseNotePath from 'utils/generate-release-note-path';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const Aside = ({ slug, label }) => (
  <aside className="absolute left-0 top-0.5 z-10 flex min-w-fit max-w-fit flex-col items-end rounded-md xl:sticky xl:top-10 xl:mt-0 xl:mr-9 xl:max-h-24 sm:static sm:max-h-max sm:flex-row sm:items-center sm:space-x-5">
    <Link theme="black" to={generateReleaseNotePath(slug)}>
      <time
        className="whitespace-nowrap text-xl font-semibold leading-none"
        dateTime={getReleaseNotesDateFromSlug(slug)}
      >
        {getReleaseNotesDateFromSlug(slug)}
      </time>
    </Link>
    <span className="mt-3.5 block rounded-[50px] bg-secondary-2 py-1 px-4 text-sm font-semibold leading-snug sm:mt-0">
      {label}
    </span>
  </aside>
);

Aside.propTypes = {
  slug: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Aside;
