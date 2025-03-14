import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';

const Row = ({
  className = '',
  title,
  description,
  linkText,
  linkUrl,
  image,
  imagePosition = 'right',
}) => (
  <div
    className={clsx(
      'gap-x-grid grid grid-cols-12 items-center gap-x-10 xl:gap-x-6 lg:gap-y-7 md:gap-y-6',
      className
    )}
  >
    <div
      className={clsx(
        'col-span-5 lg:col-span-10 lg:col-start-2 sm:col-span-full',
        imagePosition === 'right'
          ? 'col-start-2'
          : 'order-1 col-start-7 translate-x-10 justify-self-start pr-10 lg:order-none lg:translate-x-0 lg:justify-self-stretch lg:pr-0'
      )}
    >
      <h3 className="font-title text-4xl font-medium leading-tight tracking-tighter xl:text-[28px] lg:text-[24px] md:text-[22px]">
        {title}
      </h3>
      <p className="mt-2.5 text-lg font-light leading-snug xl:text-base lg:mt-2">{description}</p>
      <Link
        className="mt-3 flex items-center text-[15px] leading-none tracking-extra-tight md:mt-2"
        to={linkUrl}
        theme="green"
        withArrow
      >
        {linkText}
      </Link>
    </div>
    <div
      className={clsx(
        'col-span-5 lg:col-span-10 lg:col-start-2 sm:col-span-full',
        imagePosition === 'left' ? 'col-start-2' : 'translate-x-10 lg:translate-x-0'
      )}
    >
      <Image
        className="w-full rounded-2xl"
        width={590}
        height={387}
        src={image}
        quality={90}
        alt=""
      />
    </div>
  </div>
);

Row.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  imagePosition: PropTypes.oneOf(['left', 'right']),
};

export default Row;
