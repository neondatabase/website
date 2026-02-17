import clsx from 'clsx';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import ArrowSimple from 'icons/arrow-simple.inline.svg';

const SimpleArrowButton = forwardRef(({ className = null, mirrored = false, ...props }, ref) => (
  <button
    ref={ref}
    className={clsx(
      'flex h-7 w-7 items-center justify-center border border-gray-new-50 text-gray-new-80 transition-opacity disabled:cursor-default disabled:border-gray-new-20',
      className
    )}
    type="button"
    {...props}
  >
    <ArrowSimple className={clsx('h-3.5 w-3.5', mirrored && 'rotate-180')} />
  </button>
));

SimpleArrowButton.displayName = 'SimpleArrowButton';

SimpleArrowButton.propTypes = {
  className: PropTypes.string,
  mirrored: PropTypes.bool,
};

export default SimpleArrowButton;
