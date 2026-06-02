import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';
import { cn } from 'utils/cn';

const SplitViewGrid = ({
  className = null,
  titleClassName = null,
  label,
  title,
  description,
  items,
  isGradientLabel = false,
  ctaText = '',
  size = 'md',
}) => (
  <section className={cn('features safe-paddings', className)}>
    <Container className="grid grid-cols-12 grid-gap-x" size="medium">
      <div
        className={cn(
          'col-span-10 col-start-2 grid grid-cols-10 gap-x-10 rounded-2xl bg-black-new xl:col-span-full xl:col-start-1 xl:grid-cols-12 xl:items-center xl:gap-x-6 lg:gap-x-4',
          {
            'py-12 xl:py-8 lg:pt-9 lg:pb-10 md:py-8': size === 'md',
            'py-11': size === 'sm',
          }
        )}
      >
        <div
          className={cn(
            'col-span-4 col-start-1 flex min-w-[440px] flex-col items-start 2xl:min-w-0 xl:max-w-[300px] xl:self-start xl:justify-self-start xl:pl-8 lg:col-span-full lg:max-w-none lg:px-7 md:pr-3.5 md:pl-6',
            {
              'pl-12': size === 'md',
              'pl-11': size === 'sm',
            }
          )}
        >
          {isGradientLabel ? (
            <GradientLabel>{label}</GradientLabel>
          ) : (
            <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs leading-none font-semibold -tracking-extra-tight text-green-45 uppercase">
              {label}
            </span>
          )}
          <h2
            className={cn(
              'mt-3 font-title leading-none font-medium text-balance',
              'max-w-[322px] xl:max-w-[270px] xl:text-[44px] lg:max-w-none lg:text-4xl md:text-[32px]',
              {
                'text-[52px] tracking-extra-tight': size === 'md',
                'text-5xl tracking-tight': size === 'sm',
              },
              titleClassName
            )}
          >
            {title}
          </h2>
          <p
            className={cn('text-lg leading-snug font-light xl:text-base md:mt-2.5', {
              'mt-4': size === 'md',
              'mt-5': size === 'sm',
            })}
          >
            {description}
          </p>
        </div>
        <ul
          className={cn(
            'col-start-5 col-end-11 grid grid-cols-2 xl:col-start-6 xl:col-end-13 xl:mt-1.5 xl:-ml-8 xl:gap-x-1 lg:col-span-full lg:mt-10 lg:gap-x-10 lg:gap-y-10 lg:px-7 md:mt-[30px] md:grid-cols-1 md:gap-y-7 md:px-6',
            {
              'mt-2 gap-x-10 gap-y-11 lg:ml-0': size === 'md',
              'mx-10 mt-1 gap-x-4 gap-y-11 lg:mx-0': size === 'sm',
            }
          )}
        >
          {items.map(({ icon, title, description }, index) => (
            <li
              className={cn(
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
                  className={cn('font-title leading-tight font-medium tracking-extra-tight', {
                    'text-[22px] xl:text-xl': size === 'md',
                    'text-lg': size === 'sm',
                  })}
                >
                  {title}
                </h3>
                <p
                  className={cn(
                    'mt-2 leading-snug font-light text-gray-new-60',
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
  titleClassName: PropTypes.string,
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
