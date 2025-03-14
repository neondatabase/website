import clsx from 'clsx';
import PropTypes from 'prop-types';

const Testimonial = ({ quote, name, position, className = null }) => (
  <figure className={clsx(className)}>
    <blockquote>
      <p className="border-l border-green-45 pl-[18px] text-2xl font-normal leading-snug tracking-tighter xl:text-xl lg:py-2 lg:pr-6 xs:py-0 xs:text-base">
        {quote}
      </p>
    </blockquote>
    <figcaption className="mt-4 text-base leading-tight tracking-extra-tight lg:mt-[17px] md:mt-4 xs:text-sm">
      {name} – <cite className="inline font-light not-italic text-gray-new-70">{position}</cite>
    </figcaption>
  </figure>
);

Testimonial.propTypes = {
  quote: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Testimonial;
