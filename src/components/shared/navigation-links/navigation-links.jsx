'use client';

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
const DefaultNavigationLink = ({ link, basePath, isNext = false, showLabel = true }) => {
  const linkUrl = link?.slug && getUrl(link.slug, basePath);
  return (
    <Link
      to={linkUrl}
      className={clsx(
        'group flex w-1/2 min-w-0 flex-col gap-3 rounded border border-gray-new-20 px-4 py-5 sm:w-full',
        isNext ? 'ml-auto items-end' : 'items-start sm:hidden'
      )}
      tagName="DocsPagination"
      tagText={`${isNext ? 'Next' : 'Previous'}: ${link.title}`}
    >
      <span className="flex items-center gap-1 text-sm font-normal leading-none text-gray-new-40 dark:text-gray-new-50">
        <ArrowIcon
          className={clsx('shrink-0', !isNext && 'rotate-180', isNext && 'order-1')}
          width={17}
          height={16}
          aria-hidden="true"
          focusable="false"
        />
        {showLabel && (link.index || (isNext ? 'Next' : 'Previous'))}{' '}
      </span>
      <span
        className={clsx(
          'w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium leading-tight tracking-tight transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1',
          isNext && 'text-right',
          '[&_code]:rounded-sm [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:font-normal [&_code]:leading-none dark:[&_code]:bg-gray-new-15'
        )}
        dangerouslySetInnerHTML={{ __html: link.title }}
      />
    </Link>
  );
};
const BranchingNavigationLink = ({ link, basePath, isNext = false, showLabel = true }) => {
  const linkUrl = link?.slug && getUrl(link.slug, basePath);
  return (
    <Link
      to={linkUrl}
      className={clsx(
        'group flex w-1/2 min-w-0 max-w-[336px] items-center justify-between gap-6 border border-gray-new-20 py-4 pl-5 pr-4 lg:max-w-full sm:w-full sm:max-w-full sm:pr-5',
        isNext
          ? 'ml-auto flex-row items-end pr-4 sm:pr-5'
          : 'flex-row-reverse items-start pl-4 sm:hidden'
      )}
      tagName="DocsPagination"
      tagText={`${isNext ? 'Next' : 'Previous'}: ${link.title}`}
    >
      <span
        className={clsx(
          'flex min-w-0 max-w-[260px] flex-col',
          isNext ? 'items-start text-left' : 'items-end text-end'
        )}
      >
        <span className="flex items-center gap-1 text-xs font-normal leading-normal text-gray-new-50">
          {showLabel && (isNext ? 'Next' : 'Previous')}
        </span>
        <span
          className={clsx(
            'w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal leading-normal transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1',
            isNext ? 'text-right' : 'text-left',
            '[&_code]:rounded-sm [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:font-normal [&_code]:leading-none dark:[&_code]:bg-gray-new-15'
          )}
          dangerouslySetInnerHTML={{ __html: link.title }}
        />
      </span>
      <ArrowIcon
        className={clsx('shrink-0 text-gray-new-60', !isNext && 'rotate-180', isNext && 'order-1')}
        width={16}
        height={16}
        aria-hidden="true"
        focusable="false"
      />
    </Link>
  );
};

const NavigationLinkPropTypes = {
  title: PropTypes.string,
  slug: PropTypes.string,
  index: PropTypes.string,
};

DefaultNavigationLink.propTypes = {
  link: PropTypes.shape(NavigationLinkPropTypes),
  basePath: PropTypes.string.isRequired,
  isNext: PropTypes.bool,
  showLabel: PropTypes.bool,
};

BranchingNavigationLink.propTypes = {
  link: PropTypes.shape(NavigationLinkPropTypes),
  basePath: PropTypes.string.isRequired,
  isNext: PropTypes.bool,
  showLabel: PropTypes.bool,
};

const NavigationLinks = ({
  previousLink = null,
  nextLink = null,
  basePath,
  showLabel = true,
  branchingVariant = false,
  className,
}) => {
  /*
    TODO: Temporary split.
    Branching pages use updated pagination styling first.
    Once other docs pages are migrated, merge BranchingNavigationLink + DefaultNavigationLink into a single component.
  */

  const NavigationLink = branchingVariant ? BranchingNavigationLink : DefaultNavigationLink;

  return (
    <div
      className={clsx(
        'flex w-full',
        branchingVariant ? 'gap-8 md:gap-6' : 'gap-10 md:gap-6',
        className
      )}
    >
      {previousLink?.title && previousLink?.slug && (
        <NavigationLink link={previousLink} basePath={basePath} showLabel={showLabel} />
      )}
      {nextLink?.title && nextLink?.slug && (
        <NavigationLink link={nextLink} basePath={basePath} showLabel={showLabel} isNext />
      )}
    </div>
  );
};

NavigationLinks.propTypes = {
  previousLink: PropTypes.shape(NavigationLinkPropTypes),
  nextLink: PropTypes.shape(NavigationLinkPropTypes),
  basePath: PropTypes.string.isRequired,
  showLabel: PropTypes.bool,
  branchingVariant: PropTypes.bool,
  className: PropTypes.string,
};

export default NavigationLinks;
