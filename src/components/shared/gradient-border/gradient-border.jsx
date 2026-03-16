import { PropTypes } from 'prop-types';

import { cn } from 'utils/cn';

const GradientBorder = ({ withBlend = false, className }) => (
  <span
    className={cn(
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
