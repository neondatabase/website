import clsx from 'clsx';
import PropTypes from 'prop-types';

import Aside from 'components/pages/release-notes/aside';
import Content from 'components/shared/content';
import Link from 'components/shared/link';
import ArrowIcon from 'icons/arrow-right.inline.svg';
import generateReleaseNotePath from 'utils/generate-release-note-path';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const ReleaseNoteList = ({ className, items }) => (
  <div className={clsx('lg:space-y-16', className)}>
    {items.map(({ slug, content }, index, array) => {
      const prevItem = array[index - 1];
      const { datetime } = getReleaseNotesDateFromSlug(slug);
      const isReleaseDateExist =
        prevItem && getReleaseNotesDateFromSlug(prevItem.slug).datetime === datetime;
      const releaseNotesPath = generateReleaseNotePath(slug);

      const nextItem = array[index + 1];
      const isNextReleaseDateExist =
        nextItem && getReleaseNotesDateFromSlug(nextItem.slug).datetime === datetime;

      return (
        <article className="group flex first:mt-0 lg:flex-col lg:space-y-3" key={index}>
          <Aside
            className="w-full max-w-[149px] shrink-0 pt-0.5"
            slug={slug}
            isReleaseDateExist={isReleaseDateExist}
          />
          <div
            className={clsx(
              'relative ml-7 w-[calc(100%-176px)] pl-7 before:absolute before:-left-1 before:top-2 before:z-10 before:h-[9px] before:w-[9px] before:rounded-full before:bg-primary-1 after:absolute after:bottom-0 after:left-0 after:top-0 after:h-auto after:w-px after:bg-gray-7 group-first:after:top-2 group-last:after:bottom-6 dark:before:bg-secondary-2 dark:after:bg-gray-2 lg:ml-0 lg:w-full lg:max-w-full lg:pb-0 lg:pl-0 lg:before:hidden lg:after:hidden',
              isNextReleaseDateExist ? 'pb-6' : 'pb-12'
            )}
          >
            <Content content={content} withoutAnchorHeading />
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
