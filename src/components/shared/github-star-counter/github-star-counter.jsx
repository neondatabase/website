'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';
import GitHubIcon from 'icons/github.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

const formatStars = (starsCount) => {
  const fixedThousands = (starsCount / 1000).toFixed(1);
  if (fixedThousands.endsWith('.0')) {
    return `${fixedThousands.replace('.0', '')}k`;
  }

  return `${fixedThousands}k`;
};

const GithubStarCounter = ({ className = '', isDarkTheme = false, starsCount }) => (
  <Link
    className={clsx(
      'flex items-center gap-x-1.5 text-[13px] leading-none tracking-extra-tight transition-colors duration-200',
      className,
      isDarkTheme
        ? 'text-white hover:text-green-45'
        : 'text-gray-new-8 hover:text-green-45 dark:text-white dark:hover:text-green-45'
    )}
    to={LINKS.github}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => {
      sendGtagEvent('click_star_us_button');
    }}
  >
    <GitHubIcon width={20} height={20} />
    <span className="w-8 whitespace-nowrap" aria-label={`Star us on GitHub (${starsCount})`}>
      {formatStars(starsCount)}
    </span>
  </Link>
);

export default GithubStarCounter;

GithubStarCounter.propTypes = {
  className: PropTypes.string,
  isDarkTheme: PropTypes.bool,
  starsCount: PropTypes.number.isRequired,
};
