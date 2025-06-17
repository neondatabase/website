import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import chevronRight from 'icons/multi-tb/related-article/chevron-right.svg';
import getFormattedDate from 'utils/get-formatted-date';

const RelatedArticle = ({ title, date, link, className }) => (
  <article
    className={clsx(
      'related-article-card',
      'my-16 p-5 xl:my-14 lg:my-12 md:my-10',
      'rounded-[10px] bg-black-new ring-1 ring-gray-new-20 transition-colors hover:bg-gray-new-8',
      className
    )}
  >
    <Link className="group flex flex-row gap-8 md:gap-5" to={link}>
      <div className="flex flex-1 flex-col gap-3.5">
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

        <h3 className="text-xl font-medium leading-snug tracking-extra-tight text-white lg:text-[18px] md:text-base">
          {title}
        </h3>
      </div>
      <div className="flex shrink-0 items-center justify-center">
        <Image
          className="size-5"
          src={chevronRight}
          alt={title}
          width={20}
          height={20}
          aria-hidden
        />
      </div>
    </Link>
  </article>
);

RelatedArticle.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  link: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default RelatedArticle;
