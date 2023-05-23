import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';

const categoriesColor = {
  company: 'text-green-45 bg-green-45/10',
  community: 'text-yellow-70 bg-yellow-70/10',
  engineering: 'text-purple-70 bg-purple-70/10',
};

const Hero = ({ title, description, date, category, className = null }) => (
  <div className={className}>
    <div className="flex items-center">
      <Link
        className={clsx(
          'mr-3 rounded-[40px] px-3.5 py-2 text-xs font-semibold uppercase leading-none tracking-[0.02em] sm:text-[10px]',
          categoriesColor[category.slug] || 'bg-green-45/10 text-green-45'
        )}
        to={`${LINKS.blog}${category.slug}`}
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
    <h1 className="mt-3 text-5xl font-medium leading-dense tracking-tighter xl:text-[44px] md:text-4xl">
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
