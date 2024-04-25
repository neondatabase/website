import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';

const Card = ({
  className,
  borderClassName,
  bgClassName,
  bgImage,
  mobileBgImage = null,
  to = undefined,
  children,
}) => {
  const Tag = to ? Link : 'div';
  return (
    <Tag
      className={clsx(
        'relative flex items-end overflow-hidden rounded-[10px] p-6 xl:rounded-lg xl:p-5 lg:rounded-[10px] sm:p-4',
        to && 'group',
        className
      )}
      to={to}
    >
      <div className={clsx('absolute', bgClassName || 'inset-0')}>
        <Image
          className={clsx('h-full w-full object-cover', mobileBgImage && 'lg:hidden')}
          width={bgImage.width}
          height={bgImage.height}
          sizes="(max-width: 1024px) 440px, 240px"
          src={bgImage}
          alt=""
          unoptimized
        />
        {mobileBgImage && (
          <Image
            className={clsx('hidden h-full w-full object-cover lg:block')}
            width={mobileBgImage.width / 2}
            height={mobileBgImage.height / 2}
            src={mobileBgImage}
            alt=""
            unoptimized
          />
        )}
      </div>
      <div className={clsx('absolute inset-0 z-10 rounded-[inherit]', borderClassName)} />
      <p
        className={clsx(
          'relative z-20 text-lg leading-snug tracking-extra-tight text-gray-new-50',
          'xl:text-sm xl:leading-tight lg:text-base lg:leading-snug sm:text-[15px] sm:leading-tight'
        )}
      >
        {children}
      </p>
    </Tag>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  borderClassName: PropTypes.string,
  bgClassName: PropTypes.string,
  bgImage: PropTypes.object.isRequired,
  mobileBgImage: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default Card;
