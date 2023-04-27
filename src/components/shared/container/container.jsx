import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const styles = {
  size: {
    lg: 'max-w-[1760px] 3xl:max-w-[1472px] 2xl:px-10',
    md: 'max-w-[1760px] 3xl:max-w-[1472px] 2xl:max-w-[1216px] xl:max-w-[936px]',
    mdDoc: 'max-w-[1472px] 2xl:px-10',
    sm: 'max-w-[1460px] 2xl:max-w-[1216px] xl:max-w-[936px]',
    xs: 'max-w-[860px]',
  },
};

const Container = forwardRef(({ className = null, size, children, ...otherProps }, ref) => (
  <div
    id="container"
    className={clsx('relative mx-auto lg:max-w-none lg:px-8 md:px-4', styles.size[size], className)}
    {...otherProps}
    ref={ref}
  >
    {children}
  </div>
));

Container.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(styles.size)).isRequired,
  children: PropTypes.node.isRequired,
};

export default Container;
