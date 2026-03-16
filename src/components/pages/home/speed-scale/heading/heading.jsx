import clsx from 'clsx';
import PropTypes from 'prop-types';

const Heading = ({ className, children }) => (
  <h3
    className={clsx(
      'text-[28px] leading-snug tracking-extra-tight text-gray-new-50',
      'xl:text-2xl lg:text-xl md:text-base',
      '[&>strong]:font-normal [&>strong]:text-white',
      className
    )}
  >
    {children}
  </h3>
);

Heading.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Heading;
