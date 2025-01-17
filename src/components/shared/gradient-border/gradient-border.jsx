import clsx from 'clsx';
import { PropTypes } from 'prop-types';

const GradientBorder = ({ className }) => (
  <span
    className={clsx(
      'border-linear pointer-events-none absolute inset-0 z-10 rounded-[inherit]',
      className
    )}
    aria-hidden
  />
);

GradientBorder.propTypes = {
  className: PropTypes.string,
};

export default GradientBorder;
