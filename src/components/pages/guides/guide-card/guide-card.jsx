import Image from 'next/image';
import { PropTypes } from 'prop-types';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import { cn } from 'utils/cn';
import getFormattedDate from 'utils/get-formatted-date';

const GuideCard = ({ title, subtitle, author, createdAt, slug, isFeatured = false }) => {
  const formattedDate = getFormattedDate(createdAt);
  const Heading = isFeatured ? 'h2' : 'h3';

  return (
    <article className="h-full">
      <Link
        className={cn(
          'flex h-full flex-col rounded-sm p-6 transition-colors duration-200 lg:p-5',
          isFeatured
            ? 'min-h-[360px] bg-gray-new-98 pb-7 hover:bg-gray-new-94 dark:bg-gray-new-8 dark:hover:bg-gray-new-15 lg:min-h-[320px] md:min-h-0'
            : 'hover:bg-gray-new-98 dark:hover:bg-gray-new-8 md:rounded-none md:px-0 md:py-6 md:hover:bg-transparent dark:md:hover:bg-transparent'
        )}
        to={`${LINKS.guides}/${slug}`}
      >
        <time
          className="text-[15px] leading-none font-light tracking-extra-tight text-gray-new-50 uppercase dark:text-gray-new-70 md:text-sm"
          dateTime={createdAt}
        >
          {formattedDate}
        </time>
        <Heading
          className={cn(
            'mt-4 font-medium tracking-tighter text-balance',
            isFeatured
              ? 'line-clamp-4 text-[28px] leading-[1.2] lg:text-2xl md:line-clamp-3'
              : 'line-clamp-3 text-2xl leading-[1.2] lg:text-xl'
          )}
        >
          {title}
        </Heading>
        <div
          className={cn(
            'mt-auto flex flex-col',
            isFeatured ? 'gap-y-5 pt-8 md:pt-6' : 'gap-y-4 pt-6 md:pt-4'
          )}
        >
          <p
            className={cn(
              'leading-snug tracking-tighter text-gray-new-40 dark:text-gray-new-50',
              isFeatured ? 'line-clamp-3 lg:text-[15px]' : 'line-clamp-2 text-[15px]'
            )}
          >
            {subtitle}
          </p>
          {author && (
            <div className="flex min-w-0 items-center gap-2">
              {author.photo && (
                <Image
                  className="block shrink-0 rounded-full"
                  src={author.photo}
                  alt=""
                  width={20}
                  height={20}
                />
              )}
              <span className="shrink-0 text-[15px] leading-none tracking-extra-tight text-gray-new-30 dark:text-gray-new-90 md:text-sm">
                {author.name}
              </span>
              {author.position && (
                <span className="truncate text-[15px] leading-none tracking-extra-tight text-gray-new-50 dark:text-gray-new-60 md:text-sm">
                  {author.position}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
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
  isFeatured: PropTypes.bool,
};

export default GuideCard;
