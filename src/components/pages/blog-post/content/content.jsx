import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const Content = ({ html, className }) => (
  <div className={clsx('prose-blog prose-lg prose md:prose-base', className)}>{html}</div>
);

Content.propTypes = {
  html: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
};

Content.defaultProps = {
  className: null,
};

export default Content;
