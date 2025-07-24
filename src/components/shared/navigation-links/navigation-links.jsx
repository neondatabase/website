import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import ArrowBackIcon from 'icons/arrow-back.inline.svg';

const getUrl = (slug, basePath) => {
  if (slug.startsWith('http')) {
    return slug;
  }

  return `${basePath}${slug}`;
};

const NavigationLink = ({ link, basePath, isNext = false }) => {
  const linkUrl = link?.slug && getUrl(link.slug, basePath);

  return (
    <Link
      to={linkUrl}
      className={clsx(
        'group flex w-1/2 flex-col gap-3 rounded border border-gray-new-90 px-4 py-5 tracking-tight dark:border-gray-new-20 sm:w-full',
        isNext ? 'ml-auto items-end' : 'items-start sm:hidden'
      )}
    >
      <span className="flex items-center gap-1 text-sm font-normal leading-none text-gray-new-40 dark:text-gray-new-50">
        <ArrowBackIcon
          className={clsx('shrink-0', isNext && 'order-1 rotate-180')}
          width={14}
          height={14}
        />
        {link.index || (isNext ? 'Next' : 'Previous')}
      </span>
      <span
        className="font-medium leading-tight transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1 [&_code]:rounded-sm [&_code]:bg-gray-new-94 [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:font-normal [&_code]:leading-none dark:[&_code]:bg-gray-new-15"
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
};

const NavigationLinks = ({ previousLink = null, nextLink = null, basePath }) => (
  <div className="mt-12 flex w-full gap-6 md:mt-10 ">
    {previousLink?.title && previousLink?.slug && (
      <NavigationLink link={previousLink} basePath={basePath} />
    )}
    {nextLink?.title && nextLink?.slug && (
      <NavigationLink link={nextLink} basePath={basePath} isNext />
    )}
  </div>
);

NavigationLinks.propTypes = {
  previousLink: PropTypes.shape(NavigationLinkPropTypes),
  nextLink: PropTypes.shape(NavigationLinkPropTypes),
  basePath: PropTypes.string.isRequired,
};

export default NavigationLinks;
