import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Tweet } from 'react-tweet';

const Content = ({ html, className = null }) => (
  <>
    <Tweet id="1674679862961885184" />
    <div className={clsx('prose-blog prose prose-lg', className)}>{html}</div>
  </>
);

Content.propTypes = {
  html: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
};

export default Content;
