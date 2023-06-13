import clsx from 'clsx';
import PropTypes from 'prop-types';

import Aside from 'components/pages/release-notes/aside';
import Content from 'components/shared/content';
import Link from 'components/shared/link';
import ArrowIcon from 'icons/arrow-right.inline.svg';
import generateReleaseNotePath from 'utils/generate-release-note-path';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const ReleaseNoteList = ({ items }) => (
  <div className="relative before:absolute before:bottom-3 before:left-[179px] before:top-4 before:h-auto before:w-px before:bg-gray-7 dark:before:bg-gray-2 xl:before:hidden sm:space-y-16">
    {items.map(({ slug, content }, index, array) => {
      const prevItem = array[index - 1];
      const { datetime } = getReleaseNotesDateFromSlug(slug);
      const isReleaseDateExist =
        prevItem && getReleaseNotesDateFromSlug(prevItem.slug).datetime === datetime;

      return (
        <article
          className={clsx(
            'relative flex first:mt-0 sm:flex-col sm:space-y-3',
            isReleaseDateExist ? 'mt-6' : 'mt-12'
          )}
          key={index}
        >
          <Aside slug={slug} isReleaseDateExist={isReleaseDateExist} />

          <div className="relative w-full pl-56 before:absolute before:left-[175px] before:top-3 before:h-[9px] before:w-[9px] before:rounded-full before:bg-primary-1 dark:before:bg-secondary-2 xl:max-w-[75%] xl:pl-0 xl:before:hidden sm:max-w-full">
            <Content content={content} />
            <Link
              className="flex items-center font-medium text-secondary-8 hover:text-secondary-7 dark:text-primary-1"
              theme="black"
              to={generateReleaseNotePath(slug)}
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
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      content: PropTypes.shape({}).isRequired,
    })
  ).isRequired,
};

export default ReleaseNoteList;
