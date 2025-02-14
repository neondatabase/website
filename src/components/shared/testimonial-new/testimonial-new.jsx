import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';
import quoteIcon from 'icons/quote.svg';

const TestimonialNew = ({ className = '', quoteClassName = '', quote, name, position, avatar }) => (
  <div className={clsx('testimonial-new safe-paddings', className)}>
    <Container className="relative px-16 pt-20" size="960">
      <Image
        className="absolute left-1/2 top-0 -z-10 -ml-2.5 -translate-x-1/2"
        src={quoteIcon}
        width={104}
        height={89}
        alt=""
      />
      <figure>
        <blockquote className="mt-4 text-center">
          <p
            className={clsx(
              'bg-[radial-gradient(66.11%_247.88%_at_50%_50%,#FFF_31.15%,rgba(255,255,255,0.1)_100%)] bg-clip-text text-[28px] leading-snug tracking-tighter text-transparent',
              quoteClassName
            )}
          >
            {quote}
          </p>
        </blockquote>
        <figcaption className="mt-6 flex items-center justify-center text-lg font-light leading-tight tracking-tight text-gray-new-70">
          {avatar && (
            <Image
              className="mr-2.5 rounded-full"
              src={avatar.src}
              width={avatar.width}
              height={avatar.height}
              alt={`${name} photo`}
            />
          )}
          {name}
          <cite className="ml-1.5 not-italic before:mr-1.5 before:inline-flex before:h-px before:w-4 before:bg-gray-new-70 before:align-middle">
            {position}
          </cite>
        </figcaption>
      </figure>
    </Container>
  </div>
);

TestimonialNew.propTypes = {
  className: PropTypes.string,
  quoteClassName: PropTypes.string,
  quote: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  avatar: PropTypes.shape({
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

export default TestimonialNew;
