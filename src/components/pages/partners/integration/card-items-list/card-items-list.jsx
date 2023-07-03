import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';

const CardItemsList = ({ className = null, items, ariaHidden = false }) => (
  <ul
    className={clsx(
      'mt-8 grid max-w-[550px] grid-cols-3 gap-x-[34px] xl:gap-x-4 lg:mt-0 lg:max-w-none md:grid-cols-1 md:gap-y-4',
      className
    )}
    aria-hidden={ariaHidden}
  >
    {items.map(({ icon, title, description, url }, index) => (
      <li key={index}>
        <Link
          className="flex h-full min-h-[176px] flex-col rounded-[10px] border border-gray-new-15 px-4 pb-4 pt-5 transition-colors duration-200 hover:border-green-45 xl:min-h-[165px] xl:p-3.5 lg:min-h-max lg:p-4 md:flex-row md:gap-x-3"
          to={url}
          target={url.startsWith('http') ? '_blank' : '_self'}
          rel={url.startsWith('http') ? 'noopener noreferrer' : ''}
        >
          <img
            className="h-8 w-8 md:h-7 md:w-7"
            loading="lazy"
            src={icon}
            alt=""
            width={32}
            height={32}
            aria-hidden
          />
          <div className="mt-[38px] xl:mt-8 lg:mt-7 md:mt-0">
            <h4 className="text-xl leading-tight tracking-[-0.02em] xl:text-lg">{title}</h4>
            <p className="mt-1.5 text-[15px] font-light leading-tight text-gray-new-70 md:mt-2.5">
              {description}
            </p>
          </div>
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
