import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';

const CardItemsList = ({ className = null, items, ariaHidden = false }) => (
  <ul
    className={clsx(
      'mt-10 grid max-w-[545px] grid-cols-3 gap-x-5 xl:mt-8 lg:mt-0 lg:max-w-none',
      className
    )}
    aria-hidden={ariaHidden}
  >
    {items.map(({ icon, title, description, url }, index) => (
      <li key={index}>
        <Link
          className="flex h-full min-h-[195px] flex-col rounded-[10px] border border-gray-new-15 p-5 transition-colors duration-200 hover:border-green-45 xl:min-h-[165px] xl:p-3 lg:min-h-max lg:p-4"
          to={url}
          target={url.startsWith('http') ? '_blank' : '_self'}
          rel={url.startsWith('http') ? 'noopener noreferrer' : ''}
        >
          <img
            className="h-8 w-8"
            loading="lazy"
            src={icon}
            alt=""
            width={32}
            height={32}
            aria-hidden
          />
          <h4 className="mt-[52px] text-xl leading-tight tracking-[-0.02em] xl:mt-10 xl:text-lg">
            {title}
          </h4>
          <p className="mt-1 text-[15px] font-light leading-snug text-gray-new-70">{description}</p>
        </Link>
      </li>
    ))}
  </ul>
);

CardItemsList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  ariaHidden: PropTypes.bool,
};

export default CardItemsList;
