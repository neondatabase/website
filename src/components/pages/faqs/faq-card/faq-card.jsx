import { PropTypes } from 'prop-types';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import ArrowIcon from 'icons/arrow-right.inline.svg';

const FaqCard = ({ title, subtitle, slug }) => (
  <article className="border-b border-gray-new-15/20 pt-6 pb-5 first:pt-0 last:border-none last:pb-0 dark:border-gray-new-15/80">
    <Link className="group" to={`${LINKS.faqs}/${slug}`}>
      <div className="flex flex-col gap-y-[18px] sm:gap-y-4">
        <div className="max-w-[832px]">
          <h1 className="line-clamp-2 text-[20px] leading-tight font-semibold tracking-extra-tight transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-green-45">
            {title}
          </h1>
          <p className="mt-1.5 leading-snug tracking-tighter text-gray-new-40 dark:text-gray-new-50 sm:mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex w-fit items-center gap-1 border-b border-transparent text-secondary-8 transition-colors duration-200 group-hover:border-secondary-8 dark:text-green-45 dark:group-hover:border-green-45">
          <span className="text-[15px] leading-tight tracking-extra-tight md:text-sm">
            Read FAQ
          </span>
          <ArrowIcon className="shrink-0" />
        </div>
      </div>
    </Link>
  </article>
);

FaqCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default FaqCard;
