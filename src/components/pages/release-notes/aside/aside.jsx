import PropTypes from 'prop-types';
import React from 'react';

import { RELEASE_NOTES_CATEGORIES } from 'components/pages/release-notes/release-notes-filter';
import Link from 'components/shared/link';
import generateReleaseNotePath from 'utils/generate-release-note-path';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const Aside = ({ slug, label }) => {
  const { datetime, label: dateLabel } = getReleaseNotesDateFromSlug(slug);

  return (
    <aside className="absolute left-0 top-0.5 z-10 flex min-w-fit max-w-fit flex-col items-end rounded-md xl:sticky xl:top-10 xl:mt-0 xl:mr-9 xl:max-h-24 sm:static sm:max-h-max sm:flex-row sm:items-center sm:space-x-5">
      <Link
        className="hover:text-secondary-8 dark:hover:text-primary-2"
        theme="black"
        to={generateReleaseNotePath(slug)}
      >
        <time className="whitespace-nowrap text-xl font-semibold leading-none" dateTime={datetime}>
          {dateLabel}
        </time>
      </Link>
      <span className="mt-3 flex items-center rounded-full border border-secondary-8 py-1 px-3 text-xs font-medium leading-snug text-secondary-8 dark:border-primary-1 dark:text-primary-1 sm:mt-0">
        {RELEASE_NOTES_CATEGORIES.map(
          ({ tag, icon: Icon }, index) => tag === label && <Icon className="h-4 w-4" key={index} />
        )}
        <span className="ml-1">{label}</span>
      </span>
    </aside>
  );
};

Aside.propTypes = {
  slug: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Aside;
