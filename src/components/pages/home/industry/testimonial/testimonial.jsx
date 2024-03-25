import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

const Testimonial = ({ quote, avatar, name, position, logo, className }) => (
  <figure
    className={clsx(
      'sm:grid sm:min-h-[190px] sm:max-w-md sm:justify-self-end sm:rounded-lg sm:border sm:border-gray-new-10 sm:bg-black-new sm:p-5',
      className
    )}
  >
    <Image
      className="-m-2 hidden sm:block"
      src={logo}
      width={logo.width}
      height={logo.height}
      alt={logo.alt}
    />
    <blockquote
      className={clsx(
        'text-2xl font-light leading-snug tracking-extra-tight text-white',
        'xl:text-xl lg:text-base sm:mt-2.5 sm:text-[15px]'
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
        {name} <cite className="font-light not-italic text-gray-new-40">- {position}</cite>
      </div>
    </figcaption>
  </figure>
);

Testimonial.propTypes = {
  quote: PropTypes.string.isRequired,
  avatar: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  logo: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default Testimonial;
