import PropTypes from 'prop-types';

import Link from 'components/shared/link';

import ArrowIcon from './images/arrow.inline.svg';

const getUrl = (slug, basePath) => {
  if (slug.startsWith('http')) {
    return slug;
  }

  return `${basePath}${slug}`;
};

const PreviousAndNextLinks = ({ previousLink = null, nextLink = null, basePath }) => {
  const previousLinkUrl = previousLink && getUrl(previousLink.slug, basePath);
  const nextLinkUrl = nextLink && getUrl(nextLink.slug, basePath);
  return (
    <div className="mt-10 flex w-full space-x-10 sm:mt-7 sm:space-x-0">
      {previousLink && (
        <Link
          to={previousLinkUrl}
          className="group mr-auto flex w-1/2 items-center justify-between rounded border border-gray-new-90 p-4 dark:border-gray-new-20 sm:hidden"
        >
          <ArrowIcon className="shrink-0 rotate-180 text-gray-new-70 transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1" />
          <div className="flex flex-col items-end">
            <span className="text-sm font-normal text-gray-new-40 dark:text-gray-7">Previous</span>
            <span className="text-right font-semibold transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1">
              {previousLink.title}
            </span>
          </div>
        </Link>
      )}
      {nextLink && (
        <Link
          to={nextLinkUrl}
          className="group ml-auto flex w-1/2 items-center justify-between rounded border border-gray-new-90 p-4 text-right dark:border-gray-new-20 sm:w-full sm:space-x-3"
        >
          <div className="flex flex-col items-start">
            <span className="text-sm font-normal text-gray-new-40 dark:text-gray-7">Next</span>
            <span className="text-left font-semibold transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1">
              {nextLink.title}
            </span>
          </div>
          <ArrowIcon className="shrink-0 text-gray-new-70 transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1 sm:block" />
        </Link>
      )}
    </div>
  );
};

PreviousAndNextLinks.propTypes = {
  previousLink: PropTypes.exact({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }),
  nextLink: PropTypes.exact({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }),
  basePath: PropTypes.string.isRequired,
};

export default PreviousAndNextLinks;
