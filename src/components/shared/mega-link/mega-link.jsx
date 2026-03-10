import clsx from 'clsx';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

import Chevron from 'icons/chevron-right-lg.inline.svg';
import PointerRight from 'icons/pointer-right-red.inline.svg';
import getFormattedDate from 'utils/get-formatted-date';

const MegaLink = ({ tag, title, date, url, isExternal, className }) => (
  <NextLink
    className={clsx(
      'not-prose group my-9 flex items-center gap-8 border border-gray-new-80 bg-[#E4F1EB]/40 py-5 pl-6 pr-5',
      'transition-colors duration-200 hover:border-gray-new-70 hover:bg-[#E4F1EB]',
      'dark:border-gray-new-20 dark:bg-gray-new-8 dark:hover:border-gray-new-30 dark:hover:bg-gray-new-10',
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
          <PointerRight className="size-2.5" />
          <span className="block font-mono text-xs font-medium uppercase leading-none text-gray-new-30 dark:text-gray-new-80">
            {tag}
          </span>
        </div>
      )}
      <h3 className="m-0 text-xl !font-normal leading-snug tracking-extra-tight text-gray-new-8 dark:text-white sm:line-clamp-3">
        {title}
      </h3>
    </div>
    <Chevron className="size-4 text-gray-new-20 transition-colors duration-200 group-hover:text-gray-new-40 dark:text-white dark:group-hover:text-gray-new-80" />
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
