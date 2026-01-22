import clsx from 'clsx';
import { PropTypes } from 'prop-types';

const GradientBorder = ({ withBlend = false, className }) => (
  <span
    className={clsx(
      'pointer-events-none absolute inset-0 z-10 rounded-[inherit]',
      withBlend ? 'border border-black mix-blend-overlay dark:border-white' : 'border-linear',
      className
    )}
    aria-hidden
  />
);

GradientBorder.propTypes = {
  withBlend: PropTypes.bool,
  className: PropTypes.string,
};

export default GradientBorder;
