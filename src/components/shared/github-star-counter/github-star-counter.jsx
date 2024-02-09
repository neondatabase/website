import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import GitHubIcon from 'icons/github.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';
import sendSegmentEvent from 'utils/send-segment-event';

const GithubStarCounter = ({ className = '', isThemeBlack = false, githubStarCount }) =>
  githubStarCount && (
    <Link
      className={clsx(
        'text-16 flex items-center gap-x-2.5 leading-none tracking-extra-tight transition-colors duration-200',
        className,
        isThemeBlack
          ? 'text-white hover:text-green-45'
          : 'text-gray-new-8 hover:text-green-45 dark:text-white dark:hover:text-green-45'
      )}
      to={LINKS.github}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        sendGtagEvent('click_star_us_button');
        sendSegmentEvent('click_star_us_button');
      }}
    >
      <GitHubIcon width={20} height={20} />
      <span className="w-10 whitespace-nowrap xl:hidden">
        {`${(githubStarCount / 1000).toFixed(1)}k`}
      </span>
    </Link>
  );

export default GithubStarCounter;

GithubStarCounter.propTypes = {
  className: PropTypes.string,
  isThemeBlack: PropTypes.bool,
  githubStarCount: PropTypes.number,
};
