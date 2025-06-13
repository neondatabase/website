import clsx from 'clsx';
import NextLink from 'next/link';
import { PropTypes } from 'prop-types';

import Chevron from 'icons/chevron-right-lg.inline.svg';

const MegaLink = ({ tag, title, url, isExternal, className }) => (
  <NextLink
    className={clsx(
      'not-prose group my-8 flex items-center gap-9 rounded-lg border border-[#27272A] bg-[#09090B] p-5',
      'transition-colors duration-200 hover:border-gray-new-30',
      'sm:gap-3',
      className
    )}
    href={url}
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener noreferrer' : ''}
  >
    <div className="flex-1">
      {tag && (
        <span className="mb-3.5 block text-sm font-medium leading-none tracking-extra-tight text-primary-1">
          {tag}
        </span>
      )}
      <h3 className="m-0 text-xl font-medium leading-snug tracking-extra-tight sm:line-clamp-3">
        {title}
      </h3>
    </div>
    <Chevron className="size-4 text-gray-new-50 transition-colors duration-200 group-hover:text-gray-new-60" />
  </NextLink>
);

MegaLink.propTypes = {
  tag: PropTypes.string,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isExternal: PropTypes.bool,
  className: PropTypes.string,
};

export default MegaLink;
