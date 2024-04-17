import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

const Card = ({ className, borderClassName, bgClassName, bgImage, children }) => (
  <div
    className={clsx(
      'relative flex items-end overflow-hidden rounded-[10px] p-6 xl:rounded-lg xl:p-5 lg:rounded-[10px] sm:p-4',
      className
    )}
  >
    <div className={clsx('absolute', bgClassName || 'inset-0')}>
      <Image
        className="h-full w-full object-cover"
        width={bgImage.width}
        height={bgImage.height}
        sizes="(max-width: 1024px) 440px, 240px"
        src={bgImage}
        alt=""
        unoptimized
      />
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
  </div>
);

Card.propTypes = {
  className: PropTypes.string,
  borderClassName: PropTypes.string,
  bgClassName: PropTypes.string,
  bgImage: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default Card;
