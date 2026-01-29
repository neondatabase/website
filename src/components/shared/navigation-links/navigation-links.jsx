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

const NavigationLink = ({ link, basePath, isNext = false, showLabel = true }) => {
  const linkUrl = link?.slug && getUrl(link.slug, basePath);

  return (
    <Link
      to={linkUrl}
      className={clsx(
        'group flex w-1/2 min-w-0 flex-col gap-3 rounded-[4px] border border-gray-new-20 px-4 py-5 sm:w-full',
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
        />
        {showLabel && (link.index || (isNext ? 'Next' : 'Previous'))}
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

const NavigationLinkPropTypes = {
  title: PropTypes.string,
  slug: PropTypes.string,
  index: PropTypes.string,
};

NavigationLink.propTypes = {
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
  className,
}) => (
  <div className={clsx('flex w-full gap-10 md:gap-6', className)}>
    {previousLink?.title && previousLink?.slug && (
      <NavigationLink link={previousLink} basePath={basePath} showLabel={showLabel} />
    )}
    {nextLink?.title && nextLink?.slug && (
      <NavigationLink link={nextLink} basePath={basePath} showLabel={showLabel} isNext />
    )}
  </div>
);

NavigationLinks.propTypes = {
  previousLink: PropTypes.shape(NavigationLinkPropTypes),
  nextLink: PropTypes.shape(NavigationLinkPropTypes),
  basePath: PropTypes.string.isRequired,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
};

export default NavigationLinks;
