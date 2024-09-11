import clsx from 'clsx';
import PropTypes from 'prop-types';

const Testimonial = ({ quote, name, position, className = null, ariaHidden = false }) => (
  <figure className={clsx('mt-16 max-w-[464px]', className)} aria-hidden={ariaHidden}>
    <blockquote>
      <p className="border-l border-green-45 pl-[18px] text-2xl font-normal leading-snug tracking-tighter xl:text-xl">
        {quote}
      </p>
    </blockquote>
    <figcaption className="mt-4 text-base leading-tight tracking-extra-tight lg:mt-5 md:mt-4">
      {name} – <cite className="inline font-light not-italic text-gray-new-70">{position}</cite>
    </figcaption>
  </figure>
);

Testimonial.propTypes = {
  quote: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
};

export default Testimonial;
