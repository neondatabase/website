/* eslint-disable react/prop-types */
import Image from 'next/image';
import { PropTypes } from 'prop-types';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import getFormattedDate from 'utils/get-formatted-date';

import ArrowIcon from './images/arrow.inline.svg';

const GuideCard = ({ title, subtitle, author, createdAt, slug }) => {
  const formattedDate = getFormattedDate(createdAt);

  return (
    <Link className="group" to={`${LINKS.guides}/${slug}`}>
      <article className="flex flex-col gap-y-[18px] sm:gap-y-4">
        <div className="max-w-[640px]">
          <h1 className="line-clamp-2 text-[20px] font-semibold leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-green-45">
            {title}
          </h1>
          <p className="mt-1.5 leading-snug tracking-tighter text-gray-new-40 dark:text-gray-new-50 sm:mt-1">
            {subtitle}
          </p>
          <div className="mt-3 flex items-center gap-2 sm:mt-2.5">
            {author && (
              <div className="flex items-center gap-2">
                {author.photo && (
                  <Image
                    className="block rounded-full md:h-6 md:w-6 sm:h-5 sm:w-5"
                    src={author.photo}
                    alt={author.name}
                    width={26}
                    height={26}
                  />
                )}
                <span className="text-[15px] leading-none tracking-extra-tight text-gray-new-30 dark:text-gray-new-90 md:text-sm">
                  {author.name}
                </span>
              </div>
            )}
            <time
              className="relative block shrink-0 pl-[11px] text-[15px] font-light uppercase leading-none tracking-extra-tight text-gray-new-50 before:absolute before:left-0 before:top-1/2 before:inline-block before:h-[3px] before:w-[3px] before:rounded-full before:bg-gray-new-70 dark:text-gray-new-70 dark:before:bg-gray-new-30 md:text-sm"
              dateTime={createdAt}
            >
              {formattedDate}
            </time>
          </div>
        </div>
        <div className="flex w-fit items-center gap-1 border-b border-transparent text-secondary-8 transition-colors duration-200 group-hover:border-secondary-8 dark:text-green-45 dark:group-hover:border-green-45">
          <span className="text-[15px] leading-tight tracking-extra-tight md:text-sm">
            Read guide
          </span>
          <ArrowIcon className="shrink-0" />
        </div>
      </article>
    </Link>
  );
};

GuideCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    position: PropTypes.string,
    bio: PropTypes.string,
    link: PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
    }),
    photo: PropTypes.string,
  }).isRequired,
  createdAt: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default GuideCard;
