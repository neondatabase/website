import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { BLOG_CATEGORY_BASE_PATH, CATEGORY_BG_COLORS, CATEGORY_COLORS } from 'constants/blog';

const Hero = ({ title, description, date, category, className = null }) => (
  <div className={className}>
    <div className="flex items-center">
      <Link
        className={clsx(
          'mr-3 rounded-[40px] px-3.5 py-2 text-xs font-semibold uppercase leading-none tracking-[0.02em] sm:text-[10px]',
          CATEGORY_COLORS[category.slug] || 'text-green-45',
          CATEGORY_BG_COLORS[category.slug] || 'bg-green-45/10'
        )}
        to={`${BLOG_CATEGORY_BASE_PATH}${category.slug}`}
      >
        {category.name}
      </Link>
      <time
        className="text-[13px] uppercase leading-none tracking-[0.02em] text-gray-new-80"
        dateTime={date}
      >
        {date}
      </time>
    </div>
    <h1 className="post-title mt-3 font-title text-5xl font-medium leading-dense tracking-tighter xl:text-[44px] md:text-4xl sm:text-[32px] sm:tracking-[0.02em] xs:text-3xl">
      {title}
    </h1>
    <p className="mt-3 text-2xl leading-snug text-gray-new-90 xl:text-xl md:text-lg">
      {description}
    </p>
  </div>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,

  date: PropTypes.string.isRequired,
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

export default Hero;
