import Image from 'next/image';
import PropTypes from 'prop-types';

import GradientBorder from 'components/shared/gradient-border';
import { cn } from 'utils/cn';

const Cards = ({ data, isPriority, className }) => (
  <div
    className={cn(
      'mt-11 grid grid-cols-2 gap-5 lg:mt-8 lg:gap-4 md:mt-6 sm:grid-cols-1',
      className
    )}
  >
    {data.map(
      ({ title, description, logo, banner, borderClassName, highlightClassName }, index) => (
        <div
          className={cn(
            'relative overflow-hidden rounded-xl bg-security-card-bg p-6 lg:p-5 md:p-[18px]',
            banner && 'col-span-2 sm:col-span-1 sm:pb-[203px]',
            className
          )}
          key={index}
        >
          {logo && (
            <div className="relative z-20 mb-5 size-[76px] lg:size-16 md:size-14">
              <Image
                className={cn(
                  'absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 lg:scale-[0.85] md:scale-[0.74]',
                  logo.className
                )}
                src={logo.src}
                alt={title}
                width={logo.width}
                height={logo.height}
                priority={isPriority}
                quality={100}
              />
            </div>
          )}
          <div className={cn('relative z-20', banner && 'max-w-[504px] lg:max-w-[395px]')}>
            <h3
              className="text-[18px] leading-snug font-medium tracking-extra-tight lg:text-base md:text-[15px]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p
              className="mt-2.5 text-with-links leading-snug font-light tracking-extra-tight text-pretty text-gray-new-70 lg:mt-2 lg:text-[15px] md:text-sm sm:text-sm sm:font-light"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          {banner && (
            <>
              <Image
                className="absolute right-0 bottom-0 z-10 max-w-none lg:-right-14 sm:-right-[52px] sm:-bottom-1"
                src={banner.src}
                alt={title}
                width={banner.width}
                height={banner.height}
              />
              <span className="pointer-events-none absolute -top-10 right-1/3 h-40 w-40 -translate-y-1/2 rounded-[100%] bg-[#405ECA] opacity-35 blur-3xl sm:top-auto sm:right-auto sm:bottom-0 sm:-left-32" />
              <span className="pointer-events-none absolute -top-5 right-1/3 h-16 w-32 -translate-y-1/2 rotate-[33deg] rounded-[100%] bg-[#4F7CD2] opacity-35 blur-2xl sm:top-auto sm:right-auto sm:bottom-16 sm:-left-11" />
            </>
          )}
          <span
            className={cn(
              'pointer-events-none absolute top-5 left-5 size-16 rounded-full blur-xl lg:top-4 lg:left-4 lg:size-14 md:top-3 md:left-3 md:size-12',
              highlightClassName
            )}
            aria-hidden
          />
          <GradientBorder className={borderClassName} withBlend={!!banner} />
        </div>
      )
    )}
  </div>
);

Cards.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      logo: PropTypes.shape({
        src: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        className: PropTypes.string,
      }),
      banner: PropTypes.shape({
        src: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        className: PropTypes.string,
      }),
      borderClassName: PropTypes.string,
      highlightClassName: PropTypes.string,
    })
  ).isRequired,
  isPriority: PropTypes.bool,
  className: PropTypes.string,
};

export default Cards;
