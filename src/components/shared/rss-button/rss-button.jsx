import { PropTypes } from 'prop-types';

import RSSLogo from 'icons/rss.inline.svg';
import { cn } from 'utils/cn';

const sizes = {
  md: 'size-5',
  sm: 'size-4',
};

const RssButton = ({ className, basePath, title, size = 'md' }) => (
  <a
    className={cn(
      'text-gray-new-60 transition-colors duration-200 hover:text-secondary-8 dark:hover:text-white',
      className
    )}
    href={`${basePath}rss.xml`}
    aria-label={`${title} RSS Feed`}
  >
    <RSSLogo className={sizes[size]} />
  </a>
);

RssButton.propTypes = {
  className: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(Object.keys(sizes)),
};

export default RssButton;
