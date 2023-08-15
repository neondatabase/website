import clsx from 'clsx';
import PropTypes from 'prop-types';

import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const Aside = ({ className = '', slug, isReleaseDateExist = false }) => {
  const { datetime, label } = getReleaseNotesDateFromSlug(slug);

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
    </aside>
  );
};

Aside.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string.isRequired,
  isReleaseDateExist: PropTypes.bool,
};

export default Aside;
