import clsx from 'clsx';
import PropTypes from 'prop-types';

import { RELEASE_NOTES_CATEGORIES } from 'components/pages/release-notes/release-notes-filter';
import getReleaseNotesCategoryFromSlug from 'utils/get-release-notes-category-from-slug';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const Aside = ({ className = '', slug, isReleaseDateExist = false }) => {
  const { datetime, label } = getReleaseNotesDateFromSlug(slug);
  const { category, capitalisedCategory } = getReleaseNotesCategoryFromSlug(slug);

  return (
    <aside
      className={clsx(
        'flex flex-col items-end gap-3 rounded-md xl:sticky xl:top-10 xl:mr-9 xl:mt-0 xl:max-h-24 sm:static sm:max-h-max sm:flex-row sm:items-center',
        className
      )}
    >
      {!isReleaseDateExist && (
        <time className="whitespace-nowrap text-xl font-semibold leading-none" dateTime={datetime}>
          {label}
        </time>
      )}
      <span className="flex items-center rounded-full border border-secondary-8 px-3 py-1 text-xs font-medium leading-snug text-secondary-8 dark:border-primary-1 dark:text-primary-1 sm:mt-0">
        {RELEASE_NOTES_CATEGORIES.map(
          ({ slug, icon: Icon }, index) => slug === category && <Icon className="h-4" key={index} />
        )}
        <span className="ml-1 whitespace-nowrap">{capitalisedCategory}</span>
      </span>
    </aside>
  );
};

Aside.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string.isRequired,
  isReleaseDateExist: PropTypes.bool,
};

export default Aside;
