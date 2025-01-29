import clsx from 'clsx';
import { PropTypes } from 'prop-types';

import RSSLogo from 'icons/rss.inline.svg';

const RssButton = ({ basePath, title }) => (
  <a
    className={clsx(
      'flex size-8 shrink-0 items-center justify-center rounded',
      'border border-gray-new-90 bg-white text-gray-new-60',
      'transition-colors duration-200 hover:border-gray-new-70 hover:text-secondary-8',
      'dark:border-gray-new-20 dark:bg-black-new dark:text-gray-new-70',
      'dark:hover:border-gray-new-30 dark:hover:text-primary-1'
    )}
    href={`${basePath}rss.xml`}
    aria-label={`${title} RSS Feed`}
  >
    <RSSLogo className="size-3.5" />
  </a>
);

RssButton.propTypes = {
  basePath: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default RssButton;
