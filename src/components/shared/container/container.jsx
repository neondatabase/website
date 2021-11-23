import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Container = forwardRef(({ className: additionalClassName, children, ...otherProps }, ref) => {
  const className = clsx(
    'relative max-w-[1760px] mx-auto 3xl:max-w-[1472px] 2xl:max-w-[1216px] xl:max-w-[936px] lg:max-w-none lg:px-8 md:px-4',
    additionalClassName
  );

  return (
    <div id="container" className={className} {...otherProps} ref={ref}>
      {children}
    </div>
  );
});

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Container.defaultProps = {
  className: null,
};

export default Container;
