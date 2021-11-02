import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const Container = ({ className: additionalClassName, children, ...otherProps }) => {
  const className = clsx('relative mx-auto px-safe', additionalClassName);

  return (
    <div className={className} {...otherProps}>
      {children}
    </div>
  );
};

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Container.defaultProps = {
  className: null,
};

export default Container;
