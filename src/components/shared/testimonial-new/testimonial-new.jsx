import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';
import quoteIcon from 'icons/quote.svg';

const TestimonialNew = ({ className = '', quoteClassName = '', quote, name, position, avatar }) => (
  <div className={clsx('testimonial-new safe-paddings', className)}>
    <Container className="relative px-16 pt-20 lg:pt-[72px] md:!px-5 md:pt-16" size="960">
      <Image
        className="absolute left-1/2 top-0 -z-10 -ml-2.5 w-fit -translate-x-1/2 lg:h-[80px] md:h-[76px]"
        src={quoteIcon}
        width={104}
        height={89}
        alt=""
      />
      <figure>
        <blockquote className="mx-auto mt-4 max-w-[840px] text-center lg:max-w-[620px]">
          <p
            className={clsx(
              'bg-[radial-gradient(66.11%_247.88%_at_50%_50%,#FFF_31.15%,rgba(255,255,255,0.1)_100%)] bg-clip-text text-[28px] leading-snug tracking-tighter text-transparent lg:text-2xl md:text-xl',
              quoteClassName
            )}
          >
            {quote}
          </p>
        </blockquote>
        <figcaption className="mt-6 flex items-center justify-center text-lg font-light leading-tight tracking-tight text-gray-new-70 lg:mt-5 lg:text-base md:flex-col md:text-sm">
          {avatar && (
            <Image
              className="mr-2.5 rounded-full md:mx-auto"
              src={avatar.src}
              width={avatar.width}
              height={avatar.height}
              alt={`${name} photo`}
            />
          )}
          <span className="md:mx-auto md:mt-2 md:max-w-[70%] md:text-center">
            {name}
            <cite className="ml-1.5 not-italic text-gray-new-50 before:mr-1.5 before:inline-flex before:h-px before:w-4 before:bg-gray-new-70 before:align-middle">
              {position}
            </cite>
          </span>
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
