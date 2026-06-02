import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const Content = ({ html, className = null }) => (
  <div className={cn('prose-blog prose prose-lg', className)}>{html}</div>
);

Content.propTypes = {
  html: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
};

export default Content;
