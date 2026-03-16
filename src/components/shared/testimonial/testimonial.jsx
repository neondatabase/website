import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';
import QuoteIcon from 'icons/quote.inline.svg';

const Testimonial = ({
  className = '',
  quoteClassName = 'text-[28px] xl:text-2xl lg:text-xl md:text-lg',
  quote,
  name,
  position,
}) => (
  <div className={clsx('testimonial safe-paddings', className)}>
    <Container className="flex flex-col items-center text-center" size="xs" as="figure">
      <QuoteIcon
        className="h-[72px] w-[72px] md:h-12 md:w-12 xl:h-16 xl:w-16"
        width={72}
        height={72}
        aria-hidden
      />
      <blockquote className="mt-6 md:mt-2.5 lg:mt-4">
        <p
          className={clsx(
            'max-w-[796px] leading-snug font-light tracking-tighter lg:max-w-[584px] xl:max-w-[706px]',
            quoteClassName
          )}
        >
          {quote}
        </p>
      </blockquote>
      <figcaption className="mt-5 text-lg leading-tight tracking-extra-tight text-white md:mt-2.5 lg:mt-4 xl:text-base">
        {name} <cite className="font-light text-gray-new-70 not-italic">– {position}</cite>
      </figcaption>
    </Container>
  </div>
);

Testimonial.propTypes = {
  className: PropTypes.string,
  quoteClassName: PropTypes.string,
  quote: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
};

export default Testimonial;
