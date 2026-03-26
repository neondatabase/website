import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';
import QuoteIcon from 'icons/quote.inline.svg';
import { cn } from 'utils/cn';

const Testimonial = ({
  className = '',
  quoteClassName = 'text-[28px] xl:text-2xl lg:text-xl md:text-lg',
  quote,
  name,
  position,
}) => (
  <div className={cn('testimonial safe-paddings', className)}>
    <Container className="flex flex-col items-center text-center" size="xs" as="figure">
      <QuoteIcon
        className="h-[72px] w-[72px] xl:h-16 xl:w-16 md:h-12 md:w-12"
        width={72}
        height={72}
        aria-hidden
      />
      <blockquote className="mt-6 lg:mt-4 md:mt-2.5">
        <p
          className={cn(
            'max-w-[796px] leading-snug font-light tracking-tighter xl:max-w-[706px] lg:max-w-[584px]',
            quoteClassName
          )}
        >
          {quote}
        </p>
      </blockquote>
      <figcaption className="mt-5 text-lg leading-tight tracking-extra-tight text-white xl:text-base lg:mt-4 md:mt-2.5">
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
