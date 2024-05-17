import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Testimonial = forwardRef(
  ({ className, quote, avatar, name, position, logo, isActive }, ref) => (
    <LazyMotion features={domAnimation}>
      <m.figure
        className={clsx(
          'opacity-40 blur-[2px] sm:grid sm:min-h-[190px] sm:w-[calc(100%-32px)] sm:max-w-md sm:rounded-lg',
          'sm:shrink-0 sm:snap-center sm:border sm:border-gray-new-10 sm:bg-black-new sm:p-5',
          className
        )}
        animate={{
          opacity: isActive ? 1 : 0.4,
          filter: isActive ? 'none' : 'blur(2px)',
        }}
        transition={{ duration: 0.5 }}
        ref={ref}
      >
        <Image
          className="hidden sm:block"
          src={logo}
          width={logo.width}
          height={logo.height}
          alt={logo.alt}
        />
        <blockquote
          className={clsx(
            'text-2xl font-light leading-snug tracking-extra-tight text-[#CCC6EC] transition-colors duration-500 sm:text-white',
            'xl:text-xl lg:text-base sm:mt-2.5 sm:text-[15px]',
            {
              'text-white': isActive,
            }
          )}
        >
          <p>{quote}</p>
        </blockquote>
        <figcaption
          className={clsx(
            'mt-6 flex items-center gap-3 text-lg tracking-normal',
            'xl:mt-4 xl:gap-2.5 lg:mt-3 sm:gap-2'
          )}
        >
          <Image
            className="h-8 w-8 rounded-full grayscale xl:h-7 xl:w-7 lg:h-6 lg:w-6 sm:h-5 sm:w-5"
            src={avatar}
            width={avatar.width / 2}
            height={avatar.height / 2}
            alt={name}
          />
          <div
            className={clsx(
              'text-lg leading-normal text-gray-new-60',
              'xl:text-base lg:text-sm sm:leading-snug'
            )}
          >
            {name} <cite className="font-light not-italic text-gray-new-40">– {position}</cite>
          </div>
        </figcaption>
      </m.figure>
    </LazyMotion>
  )
);

Testimonial.propTypes = {
  className: PropTypes.string,
  quote: PropTypes.string.isRequired,
  avatar: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  logo: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default Testimonial;
