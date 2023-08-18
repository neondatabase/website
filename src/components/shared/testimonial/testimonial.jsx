import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';

import QuoteIcon from './images/quote.inline.svg';

const Testimonial = ({ className = '', quote, name, position }) => (
  <div className={clsx('testimonial safe-paddings', className)}>
    <Container className="flex flex-col items-center text-center" size="xs" as="figure">
      <QuoteIcon
        className="h-[72px] w-[72px] xl:h-16 xl:w-16 md:h-12 md:w-12"
        width={72}
        height={72}
        aria-hidden
      />
      <blockquote className="mt-6 lg:mt-4 md:mt-2.5">
        <p className="max-w-[796px] text-[28px] font-light leading-snug tracking-tighter xl:max-w-[706px] xl:text-2xl lg:max-w-[584px] lg:text-xl md:text-lg">
          {quote}
        </p>
      </blockquote>
      <figcaption className="mt-5 text-lg leading-tight tracking-[-0.02em] text-white xl:text-base lg:mt-4 md:mt-2.5">
        {name} <cite className="font-light not-italic text-gray-new-70">– {position}</cite>
      </figcaption>
    </Container>
  </div>
);

Testimonial.propTypes = {
  className: PropTypes.string,
  quote: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
};

export default Testimonial;
