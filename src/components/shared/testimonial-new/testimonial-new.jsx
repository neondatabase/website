import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';
import quoteIcon from 'icons/quote.svg';

const TestimonialNew = ({ className = '', quoteClassName = '', quote, name, position, logo }) => (
  <div className={clsx('testimonial-new safe-paddings', className)}>
    <Container className="relative px-24 pt-20" size="960">
      <Image
        className="absolute -left-7 -top-2 -z-10"
        src={quoteIcon}
        width={252}
        height={208}
        alt=""
      />
      <figure>
        <blockquote className="mt-6">
          <p
            className={clsx(
              'max-w-[796px] text-[28px] leading-snug tracking-tighter text-white',
              quoteClassName
            )}
          >
            “{quote}”
          </p>
        </blockquote>
        <figcaption className="mt-7 text-lg font-light leading-tight tracking-tight text-gray-new-70">
          {name}
          <cite className="not-italic">, {position}</cite>
        </figcaption>
      </figure>
      <Image
        className="relative mt-2 h-7 w-auto"
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt={logo.alt}
      />
    </Container>
  </div>
);

TestimonialNew.propTypes = {
  className: PropTypes.string,
  quoteClassName: PropTypes.string,
  quote: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  logo: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

export default TestimonialNew;
