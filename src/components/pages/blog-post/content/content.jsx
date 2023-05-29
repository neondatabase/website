import clsx from 'clsx';
import PropTypes from 'prop-types';

const Content = ({ html, className = null }) => (
  <div className={clsx('prose-blog prose prose-lg', className)}>{html}</div>
);

Content.propTypes = {
  html: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
};

export default Content;
