import clsx from 'clsx';
import { PropTypes } from 'prop-types';

import RSSLogo from 'icons/rss.inline.svg';

const RssButton = ({ className, basePath, title }) => (
  <a
    className={clsx(
      'text-gray-new-60 transition-colors duration-200 hover:text-secondary-8 dark:hover:text-primary-1',
      className
    )}
    href={`${basePath}rss.xml`}
    aria-label={`${title} RSS Feed`}
  >
    <RSSLogo className="size-5" />
  </a>
);

RssButton.propTypes = {
  className: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default RssButton;
