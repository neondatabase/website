import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const styles = {
  size: {
    lg: 'max-w-[1760px] 3xl:max-w-[1472px] 2xl:px-10',
    md: 'max-w-[1760px] 3xl:max-w-[1472px] 2xl:max-w-[1216px] xl:max-w-[936px]',
    medium: 'max-w-[1472px] 2xl:px-10',
    sm: 'max-w-[1460px] 2xl:max-w-[1216px] xl:max-w-[936px]',
    xs: 'max-w-[860px]',
    xxs: 'max-w-[704px] md:px-5',
    1408: 'max-w-[1472px] px-8',
    1344: 'max-w-[1408px] px-8',
    1220: 'max-w-[1220px] xl:px-8',
    1216: 'max-w-[1216px] xl:px-8',
    1152: 'max-w-[1152px]',
    1100: 'max-w-[1100px]',
    960: 'max-w-[960px]',
    768: 'max-w-[768px]',
  },
};

const Container = forwardRef(
  ({ className = null, size, children, as = 'div', ...otherProps }, ref) => {
    const Tag = as;
    return (
      <Tag
        className={clsx(
          'relative mx-auto lg:max-w-none lg:px-8 md:px-4',
          styles.size[size],
          className
        )}
        {...otherProps}
        ref={ref}
      >
        {children}
      </Tag>
    );
  }
);

Container.propTypes = {
  className: PropTypes.string,
  as: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(styles.size)).isRequired,
  children: PropTypes.node.isRequired,
};

export default Container;
