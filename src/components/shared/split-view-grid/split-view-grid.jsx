import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';

const SplitViewGrid = ({
  className = null,
  label,
  title,
  description,
  items,
  isGradientLabel = false,
  ctaText = '',
  size = 'md',
}) => (
  <section className={clsx('benefits safe-paddings', className)}>
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div
        className={clsx(
          'col-span-10 col-start-2 grid grid-cols-10 gap-x-10 rounded-2xl bg-black-new xl:col-span-full xl:col-start-1 xl:grid-cols-12 xl:items-center xl:gap-x-6 lg:gap-x-4',
          {
            'py-12 xl:py-8 lg:pb-10 lg:pt-9 md:py-8': size === 'md',
            'py-11': size === 'sm',
          }
        )}
      >
        <div
          className={clsx(
            'col-span-4 col-start-1 flex min-w-[440px] flex-col items-start 2xl:min-w-0 xl:max-w-[300px] xl:self-start xl:justify-self-start xl:pl-8 lg:col-span-full lg:max-w-none lg:px-7 md:pl-6 md:pr-3.5',
            {
              'pl-12': size === 'md',
              'pl-11': size === 'sm',
            }
          )}
        >
          {isGradientLabel ? (
            <GradientLabel>{label}</GradientLabel>
          ) : (
            <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none tracking-[0.02em] text-green-45">
              {label}
            </span>
          )}
          <h2
            className={clsx('mt-3 font-title font-medium leading-none', {
              'max-w-[322px] text-[52px] tracking-[-0.02em] xl:max-w-[270px] xl:text-[44px] lg:max-w-none lg:text-4xl md:text-[32px]':
                size === 'md',
              'text-5xl tracking-tight': size === 'sm',
            })}
          >
            {title}
          </h2>
          <p
            className={clsx(
              'max-w-[362px] text-lg font-light leading-snug xl:max-w-[280px] xl:text-base lg:max-w-[648px] md:mt-2.5 sm:max-w-none sm:pr-1.5',
              {
                'mt-4': size === 'md',
                'mt-5': size === 'sm',
              }
            )}
          >
            {description}
          </p>
        </div>
        <ul
          className={clsx(
            'col-start-5 col-end-11 grid grid-cols-2 xl:col-start-6 xl:col-end-13 xl:-ml-8 xl:mt-1.5 xl:gap-x-1 lg:col-span-full lg:mt-10 lg:gap-x-10 lg:gap-y-10 lg:px-7 md:mt-[30px] md:grid-cols-1 md:gap-y-7 md:px-6',
            {
              'mt-2 gap-x-10 gap-y-11 lg:ml-0': size === 'md',
              'mx-10 mt-1 gap-x-4 gap-y-11 lg:mx-0': size === 'sm',
            }
          )}
        >
          {items.map(({ icon, title, description }, index) => (
            <li
              className={clsx(
                'flex max-w-[290px] items-start gap-x-3.5 xl:max-w-[248px] lg:max-w-[304px] lg:even:pr-0 md:max-w-none md:gap-x-3',
                size === 'md' && 'even:pr-4'
              )}
              key={index}
            >
              <img
                className="mt-0.5 shrink-0"
                src={icon}
                alt=""
                loading="lazy"
                width={24}
                height={24}
                aria-hidden
              />
              <div className="flex flex-col">
                <h3
                  className={clsx('font-title font-medium leading-tight tracking-[-0.02em]', {
                    'text-[22px] xl:text-xl': size === 'md',
                    'text-lg': size === 'sm',
                  })}
                >
                  {title}
                </h3>
                <p
                  className={clsx(
                    'mt-2 font-light leading-snug text-gray-new-60',
                    size === 'sm' && 'text-sm'
                  )}
                >
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {ctaText && (
        <p
          className="col-span-full mt-5 text-center text-gray-new-90 [&>a]:text-green-45 [&>a]:underline [&>a]:decoration-green-45/40 [&>a]:underline-offset-4 [&>a]:transition-colors [&>a]:duration-500 [&>a]:hover:decoration-green-45/0"
          dangerouslySetInnerHTML={{ __html: ctaText }}
        />
      )}
    </Container>
  </section>
);

SplitViewGrid.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  isGradientLabel: PropTypes.bool,
  ctaText: PropTypes.string,
  size: PropTypes.oneOf(['md', 'sm']),
};

export default SplitViewGrid;
