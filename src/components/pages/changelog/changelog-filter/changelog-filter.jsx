import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { CHANGELOG_BASE_PATH } from 'constants/docs';
import PlansIcon from 'icons/calendar-icon.inline.svg';
import ConsoleIcon from 'icons/console-icon.inline.svg';
import DocsIcon from 'icons/docs-icon.inline.svg';
import DriversIcon from 'icons/gear-icon.inline.svg';
import StorageIcon from 'icons/storage-icon.inline.svg';
import getChangelogCategoryFromSlug from 'utils/get-changelog-category-from-slug';

export const CHANGELOG_CATEGORIES = [
  {
    icon: StorageIcon,
    slug: 'storage-and-compute',
  },
  {
    icon: ConsoleIcon,
    slug: 'console',
  },
  {
    icon: DocsIcon,
    slug: 'docs',
  },
  {
    icon: DriversIcon,
    slug: 'drivers',
  },
  {
    icon: PlansIcon,
    slug: 'plans',
  },
];

const ChangelogFilter = ({ currentSlug }) => (
  <section className="mb-10 mt-4 flex items-center sm:flex-col sm:items-start">
    <h3 className="shrink-0 self-start text-base font-semibold text-black dark:text-white ">
      Filter by category:
    </h3>
    <ul className="ml-5 flex flex-wrap items-center gap-2 sm:ml-0 sm:mt-4">
      <li>
        <Link className="group transition-none" theme="black" to={CHANGELOG_BASE_PATH}>
          <span
            className={clsx(
              'flex items-center rounded-full border px-3 py-1 text-xs font-medium leading-snug transition-colors duration-200 group-hover:border-secondary-8 group-hover:text-secondary-8 sm:mt-0 dark:group-hover:border-primary-1 dark:group-hover:text-primary-1',
              currentSlug === 'changelog'
                ? 'border-secondary-8 text-secondary-8 dark:border-primary-1 dark:text-primary-1'
                : 'border-gray-6 dark:border-gray-4'
            )}
          >
            <span>All</span>
          </span>
        </Link>
      </li>
      {CHANGELOG_CATEGORIES.map(({ slug, icon: Icon }, index) => {
        const isCategoryActive = currentSlug === slug;
        const { capitalisedCategory } = getChangelogCategoryFromSlug(slug);

        return (
          <li key={index}>
            <Link className="group transition-none" theme="black" to={CHANGELOG_BASE_PATH + slug}>
              <span
                className={clsx(
                  'flex items-center rounded-full border px-3 py-1 text-xs font-medium leading-snug transition-colors duration-200 group-hover:border-secondary-8 group-hover:text-secondary-8 sm:mt-0 dark:group-hover:border-primary-1 dark:group-hover:text-primary-1',
                  isCategoryActive
                    ? 'border-secondary-8 text-secondary-8 dark:border-primary-1 dark:text-primary-1'
                    : 'border-gray-6 dark:border-gray-4'
                )}
              >
                <Icon
                  className={clsx(
                    'mr-1 h-4 transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1',
                    isCategoryActive
                      ? 'text-secondary-8 dark:text-primary-1'
                      : 'text-gray-6 dark:text-gray-4'
                  )}
                />
                <span>{capitalisedCategory}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  </section>
);

ChangelogFilter.propTypes = {
  currentSlug: PropTypes.string,
};

export default ChangelogFilter;
