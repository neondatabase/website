import clsx from 'clsx';
import Image from 'next/image';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

import Chevron from 'icons/chevron-right-lg.inline.svg';
import getFormattedDate from 'utils/get-formatted-date';

const triangleIcon = '/images/icons/arrow-right.svg';

const MegaLink = ({ tag, title, date, url, isExternal, className }) => (
  <NextLink
    className={clsx(
      'not-prose group my-8 flex items-center gap-9 border border-gray-new-20 px-6 py-5',
      'transition-colors duration-200 hover:border-gray-new-30',
      'sm:gap-3',
      className
    )}
    href={url}
    target={isExternal ? '_blank' : '_self'}
    rel={isExternal ? 'noopener noreferrer' : ''}
  >
    <div className="flex flex-1 flex-col gap-3.5">
      {date && (
        <div className="flex gap-6 md:gap-4">
          <div className="flex items-center justify-start gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-45" aria-hidden />
            <span className="justify-start text-base font-medium leading-none tracking-extra-tight text-gray-new-70 md:text-sm">
              Read more
            </span>
          </div>
          <time
            dateTime={date.toISOString()}
            className="text-base font-medium leading-none tracking-extra-tight text-gray-new-40 md:text-sm"
          >
            {getFormattedDate(date)}
          </time>
        </div>
      )}
      {tag && (
        <div className="flex items-center gap-1.5">
          <Image src={triangleIcon} width={10} height={10} alt="" />
          <span className="block font-mono text-xs font-medium uppercase leading-none text-gray-new-80">
            {tag}
          </span>
        </div>
      )}
      <h3 className="m-0 text-xl font-normal leading-snug tracking-extra-tight sm:line-clamp-3">
        {title}
      </h3>
    </div>
    <Chevron className="size-4 text-gray-new-50 transition-colors duration-200 group-hover:text-gray-new-60" />
  </NextLink>
);

MegaLink.propTypes = {
  tag: PropTypes.string,
  title: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date),
  url: PropTypes.string.isRequired,
  isExternal: PropTypes.bool,
  className: PropTypes.string,
};

export default MegaLink;
