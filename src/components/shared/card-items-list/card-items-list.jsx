import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import ArrowIcon from 'icons/arrow-sm.inline.svg';

const CardItemsList = ({ className = null, items, ariaHidden = false, size = 'md' }) => {
  const isLarge = size === 'lg';
  return (
    <ul
      className={clsx(
        'grid grid-cols-3 2xl:gap-x-4 md:grid-cols-1',
        isLarge ? 'md:gap-y-3.5' : ' md:gap-y-2.5',
        className
      )}
      aria-hidden={ariaHidden}
    >
      {items.map(({ icon, title, description, url }, index) => (
        <li key={index}>
          <Link
            className={clsx(
              'group flex h-full min-h-[176px] flex-col rounded-[10px] border border-gray-new-15 transition-colors duration-200 hover:border-green-45 xl:min-h-[165px] lg:min-h-max md:flex-row md:gap-x-3',
              isLarge
                ? 'p-5 xl:pb-4 lg:p-4 md:p-5 sm:flex-col sm:space-y-3'
                : 'px-5 pb-4 pt-5 xl:p-3.5 lg:p-4'
            )}
            to={url}
            target={url.startsWith('http') ? '_blank' : '_self'}
            rel={url.startsWith('http') ? 'noopener noreferrer' : ''}
          >
            <img
              className={clsx('h-8 w-8', isLarge ? '' : 'md:h-7 md:w-7')}
              loading="lazy"
              src={icon}
              alt=""
              width={32}
              height={32}
              aria-hidden
            />
            <div
              className={clsx(isLarge ? 'mt-5 lg:mt-4' : 'mt-[38px] xl:mt-8 lg:mt-7', 'md:mt-0')}
            >
              <h4
                className={clsx(
                  'text-xl leading-tight tracking-[-0.02em]',
                  isLarge ? '' : 'xl:text-lg'
                )}
              >
                {title}
              </h4>
              <p
                className={clsx(
                  'mt-1.5 text-[15px] font-light leading-tight text-gray-new-70',
                  isLarge ? 'mb-8 lg:mb-5 lg:mt-1.5 md:mb-3 md:mt-1' : 'md:mt-2.5'
                )}
              >
                {description}
              </p>
              {isLarge && (
                <div className="mt-auto inline-flex items-center text-green-45 transition-colors duration-200 group-hover:text-primary-2">
                  <span className="text-[15px] leading-none tracking-extra-tight">
                    View example
                  </span>
                  <ArrowIcon className="ml-2 shrink-0" />
                </div>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

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
  size: PropTypes.oneOf(['lg', 'md']),
};

export default CardItemsList;
