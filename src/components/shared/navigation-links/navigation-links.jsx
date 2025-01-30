import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';

import ArrowIcon from './images/arrow.inline.svg';

const getUrl = (slug, basePath) => {
  if (slug.startsWith('http')) {
    return slug;
  }

  return `${basePath}${slug}`;
};

const NavigationLinks = ({ previousLink = null, nextLink = null, basePath }) => {
  const previousLinkUrl = previousLink?.slug && getUrl(previousLink.slug, basePath);
  const nextLinkUrl = nextLink?.slug && getUrl(nextLink.slug, basePath);

  return (
    <div className="mt-16 flex w-full space-x-10 sm:mt-[50px] sm:space-x-0">
      {previousLink?.title && previousLink?.slug && (
        <Link
          to={previousLinkUrl}
          className={clsx(
            'group mr-auto flex w-1/2 items-center justify-between rounded border border-gray-new-90 p-4 dark:border-gray-new-20 sm:w-full sm:space-x-3',
            nextLink?.title && nextLink?.slug && 'sm:hidden'
          )}
        >
          <ArrowIcon className="shrink-0 rotate-180 text-gray-new-70 transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1 sm:block" />
          <div className="flex flex-col items-end">
            <span className="text-sm font-normal text-gray-new-40 dark:text-gray-new-90">
              Previous
            </span>
            <span
              className="text-right font-semibold transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1 [&_code]:rounded-sm [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:font-normal [&_code]:leading-none dark:[&_code]:bg-gray-new-15"
              dangerouslySetInnerHTML={{ __html: previousLink.title }}
            />
          </div>
        </Link>
      )}
      {nextLink?.title && nextLink?.slug && (
        <Link
          to={nextLinkUrl}
          className="group ml-auto flex w-1/2 items-center justify-between rounded border border-gray-new-90 p-4 text-right dark:border-gray-new-20 sm:w-full sm:space-x-3"
        >
          <div className="flex flex-col items-start">
            <span className="text-sm font-normal text-gray-new-40 dark:text-gray-new-90">Next</span>
            <span
              className="text-left font-semibold transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1 [&_code]:rounded-sm [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:font-normal [&_code]:leading-none dark:[&_code]:bg-gray-new-15"
              dangerouslySetInnerHTML={{ __html: nextLink.title }}
            />
          </div>
          <ArrowIcon className="shrink-0 text-gray-new-70 transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1 sm:block" />
        </Link>
      )}
    </div>
  );
};

NavigationLinks.propTypes = {
  previousLink: PropTypes.exact({
    title: PropTypes.string,
    slug: PropTypes.string,
  }),
  nextLink: PropTypes.exact({
    title: PropTypes.string,
    slug: PropTypes.string,
  }),
  basePath: PropTypes.string.isRequired,
};

export default NavigationLinks;
