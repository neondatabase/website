import clsx from 'clsx';
import PropTypes from 'prop-types';

import Content from 'components/shared/content';
import Link from 'components/shared/link';
import ArrowIcon from 'icons/arrow-right.inline.svg';
import generateReleaseNotePath from 'utils/generate-release-note-path';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const ReleaseNoteList = ({ className, items }) => (
  <div className={clsx('sm:space-y-16', className)}>
    {items.map(({ slug, content }, index) => {
      const { datetime, label } = getReleaseNotesDateFromSlug(slug);
      const releaseNotesPath = generateReleaseNotePath(slug);

      return (
        <article className="group flex first:mt-0 lg:flex-col lg:space-y-3" key={index}>
          <div
            className={clsx(
              'relative ml-1.5 w-full pb-12 pl-7 before:absolute before:-left-1 before:top-2 before:z-10 before:h-[9px] before:w-[9px] before:rounded-full before:bg-primary-1 after:absolute after:bottom-0 after:left-0 after:top-0 after:h-auto after:w-px after:bg-gray-7 group-first:after:top-2 group-last:after:bottom-6 dark:before:bg-secondary-2 dark:after:bg-gray-2 sm:ml-0 sm:max-w-full sm:pb-0 sm:pl-0 sm:before:hidden sm:after:hidden'
            )}
          >
            <time
              className="whitespace-nowrap text-xl font-semibold leading-normal"
              dateTime={datetime}
            >
              {label}
            </time>

            <Content className="mt-3 prose-h3:text-lg" content={content} withoutAnchorHeading />
            <Link
              className="flex items-center font-medium text-secondary-8 hover:text-secondary-7 dark:text-primary-1"
              theme="black"
              to={releaseNotesPath}
            >
              Release note page
              <ArrowIcon className="ml-2" aria-hidden />
            </Link>
          </div>
        </article>
      );
    })}
  </div>
);

ReleaseNoteList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      content: PropTypes.shape({}).isRequired,
    })
  ).isRequired,
};

export default ReleaseNoteList;
