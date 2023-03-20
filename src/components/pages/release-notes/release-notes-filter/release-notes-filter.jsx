import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { RELEASE_NOTES_BASE_PATH } from 'constants/docs';
import ConsoleIcon from 'icons/console-icon.inline.svg';
import DocsIcon from 'icons/docs-icon.inline.svg';
import ServerlessIcon from 'icons/serverless-icon.inline.svg';
import StorageIcon from 'icons/storage-icon.inline.svg';

export const RELEASE_NOTES_CATEGORIES = [
  {
    tag: 'Storage',
    icon: StorageIcon,
    slug: 'storage',
  },
  {
    tag: 'Console',
    icon: ConsoleIcon,
    slug: 'console',
  },
  {
    tag: 'Docs',
    icon: DocsIcon,
    slug: 'docs',
  },
  {
    tag: 'Drivers',
    icon: ServerlessIcon,
    slug: 'drivers',
  },
  {
    tag: 'Plans',
    icon: ServerlessIcon,
    slug: 'plans',
  },
];

const ReleaseNotesFilter = ({ currentSlug }) => (
  <section className="mt-4 mb-10 flex items-center sm:flex-col sm:items-start">
    <h3 className="shrink-0 self-start text-base font-semibold text-black dark:text-white ">
      Filter by category:
    </h3>
    <ul className="ml-5 flex flex-wrap items-center gap-2 sm:ml-0 sm:mt-4">
      <li>
        <Link className="group transition-none" theme="black" to={RELEASE_NOTES_BASE_PATH}>
          <span
            className={clsx(
              'flex items-center rounded-full border py-1 px-3 text-xs font-medium leading-snug transition-colors duration-200 group-hover:border-secondary-8 group-hover:text-secondary-8 dark:group-hover:border-primary-1 dark:group-hover:text-primary-1 sm:mt-0',
              currentSlug === 'release-notes'
                ? 'border-secondary-8 text-secondary-8 dark:border-primary-1 dark:text-primary-1'
                : 'border-gray-6 dark:border-gray-4'
            )}
          >
            <span>All</span>
          </span>
        </Link>
      </li>
      {RELEASE_NOTES_CATEGORIES.map(({ tag, slug, icon: Icon }, index) => {
        const isCategoryActive = currentSlug === tag.charAt(0).toLowerCase() + tag.slice(1);

        return (
          <li key={index}>
            <Link
              className="group transition-none"
              theme="black"
              to={RELEASE_NOTES_BASE_PATH + slug}
            >
              <span
                className={clsx(
                  'flex items-center rounded-full border py-1 px-3 text-xs font-medium leading-snug transition-colors duration-200 group-hover:border-secondary-8 group-hover:text-secondary-8 dark:group-hover:border-primary-1 dark:group-hover:text-primary-1 sm:mt-0',
                  isCategoryActive
                    ? 'border-secondary-8 text-secondary-8 dark:border-primary-1 dark:text-primary-1'
                    : 'border-gray-6 dark:border-gray-4'
                )}
              >
                <Icon
                  className={clsx(
                    'mr-1 h-4 w-4 transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1',
                    isCategoryActive
                      ? 'text-secondary-8 dark:text-primary-1'
                      : 'text-gray-6 dark:text-gray-4'
                  )}
                />
                <span>{tag}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  </section>
);

ReleaseNotesFilter.propTypes = {
  currentSlug: PropTypes.string,
};

export default ReleaseNotesFilter;
